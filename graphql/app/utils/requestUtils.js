'use strict';
const Joi = require('joi');
const Promise = require('bluebird');

function streamToString(stream) {
    return new Promise(function(resolve){
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
        return streamToString(data[key]);
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
        Joi.validate(object, schema, function (err) {
            if (err) reject(err);
            resolve(object);
        });
    });
}

module.exports.getString = getString;
module.exports.getObject = getObject;
module.exports.validateObject = validateObject;