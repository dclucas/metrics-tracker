'use strict';
const 
    _ = require('lodash'),
    fs = require('fs'),
    Joi = require('joi'),
    Promise = require('bluebird'),
    uuid = require('uuid');

function streamToString(stream, cb) {
    return new Promise(function(resolve, reject){
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk.toString());
        });
        stream.on('end', () => {
            resolve(chunks.join(''));
        });
    });
}

function getString(request, key) {
    const data = request.payload;
    if (data[key]) {
        return streamToString(data[key])
    } else {
        return Promise.reject(`Missing data in '${key}' field`);
    }
}

function getObject(request, key) {
    return getString(request, key)
    .then(JSON.parse);
}

function validateObject(object, schema) {
    return new Promise(function(resolve, reject) {
        Joi.validate(object, schema, function (err, value) {
            if (err) reject(err);
            resolve(object);
        });
    })
}

module.exports.getString = getString;
module.exports.getObject = getObject;
module.exports.validateObject = validateObject;