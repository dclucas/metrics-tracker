'use strict';
const 
    fs = require('fs'),
    Joi = require('joi');

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

function getObject(request) {
    const data = request.payload;
    if (data.cucumber) {
        return streamToString(data.cucumber)
        .then(function(str) {
            return JSON.parse(str);
        });
    }
    return Promise.reject();
}

function validateObject(object, schema) {
    return new Promise(function(resolve, reject) {
        Joi.validate(object, schema, function (err, value) {
            if (err) reject(err);
            resolve(object);
        });
    })
}

const cucumberSchema = Joi.array().items(Joi.object().keys({
    id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string(),
    line: Joi.number().integer(),
    keyword: Joi.string(),
    uri: Joi.string(),
    elements: Joi.array().items(Joi.object().keys({
        name: Joi.string().required(),
        id: Joi.string().required(),
        line: Joi.number().integer(),
        keyword: Joi.string(),
        description: Joi.string(),
        type: Joi.string().required(),
        steps: Joi.array().items(Joi.object().keys({
            name: Joi.string(),
            line: Joi.number().integer(),
            keyword: Joi.string(),
            result: Joi.object().keys({
                status: Joi.string(),
                duration: Joi.number().integer()
            }),
            match: Joi.object().keys({
                location: Joi.string()
            })
        }))
    }))
}));

module.exports = function (server) {
    server.route({
        method: 'POST',
        path: '/upload/cucumber',
        config: {
            tags: ['upload'],
            payload: {
                //allow: ['multipart/form-data'],
                parse: true,
                output: 'stream'
            }
        },
        
        handler: function(request, reply) {
            console.log(request);
            return getObject(request)
            //fixme: change status code to something more significant
            .catch(e => reply(e.message).statusCode(429))
            .then(o => validateObject(o, cucumberSchema))
            .catch(e => reply(e.message).statusCode(429))
            .then(function(o) {
                console.log(o);
                return reply("done").code(202);
            });
        }
    });
}
