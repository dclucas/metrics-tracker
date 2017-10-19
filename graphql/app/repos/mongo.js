'use strict'

var mf = require('mongo-func');

const R = require('ramda');
const { MongoClient } = require('mongodb');
const uuid = require('uuid');

const transformSchema = module.exports.transformSchema = mapSchema;

//const transformSchemaP = entryP => entryP.then(entry => entry? R.assoc('id', entry._id, R.omit('_id', entry)) : null);
const transformSchemaP = entryP => entryP.then(mapSchema);

const transformSchemas = col => R.map(transformSchema, col);

const transformSchemasP = colP => colP.then(transformSchemas);

const transformInput = module.exports.transformInput = entry => entry? R.assoc('_id', entry.id, R.omit('id', entry)) : null;

function mapSchema(entry) {
    // fixme: this horrid conversion is not performant -- change it to proper key replacement
    const entryStr = JSON.stringify(entry).replace(/"_id":/g, '"id":');
    console.log(entryStr);
    return JSON.parse(entryStr);
}


function mapInput(entry) {
    return entry? R.assoc('_id', entry.id, R.omit('id', entry)) : null;
}

async function findAndMap(col, criteria) {
    return col.find(criteria).toArray().then(arr => R.map(mapSchema, arr));
}

async function findOne(col, criteria) {
    return mapSchema(await col.findOne(criteria));
}

function getAll(col) {
    return findAndMap(col, {})
}

async function getById(col, id) {
    return mapSchema(await col.findOne({ _id: id }));
}

function add(col, entry) {
    const fullEntry = R.merge({ id: uuid.v4() }, entry);
    return fullEntry;
}

function mapUserInput(input) {
    return R.merge({ accounts: [], stats: [] }, input);
}

function addToInnerCollection(col, id, item, path) {
    return col.updateOne(
        { _id : id},
        {
            $push: R.assoc(path, item, {})
        });
}

function removeFromInnerCollection(col, id, itemMatcher, path) {
    return col.updateOne(
        { _id : id},
        {
            $pull: R.assoc(path, itemMatcher, {})
        });
}


function remove(col, id) {
    return col.deleteOne({_id : id});
}

const createBaseRepo = module.exports.createRepo = function (collectionName, config, logger) {
    const client = R.reduce(
        (acc, key) => R.assoc(key, mf[key](config.mongodbUrl), acc),
        {},
        R.keys(mf));
    return {
        add: async (entry) => {
            const fullEntry = R.merge({ id: uuid.v4() }, entry);
            await client.insert(collectionName, transformInput(fullEntry))();
            return fullEntry;
        },
        find: async (criteria = {}) => transformSchemasP(client.find(collectionName, criteria)()),
        findOne: async (criteria) => transformSchemaP(client.findOne(collectionName, criteria)()),
        findById: async (id) => transformSchemaP(client.findOne(collectionName, { _id: id })()),
        remove: async (id) => client.remove(collectionName, {_id: id }),
        update: async (criteria, update) => client.update(collectionName, criteria, update)(),
    }
}
