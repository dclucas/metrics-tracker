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

module.exports = function (server, emitter) {
    server.route({
        method: 'POST',
        path: '/upload/cucumber',
        config: {
            tags: ['upload'],
            payload: {
                //allow: ['multipart/form-data'],
                parse: true,
                output: 'stream'
            },
            validate: {
                query: {
                    assessmentKey: Joi.string().required(),
                    subjectKey: Joi.string().required(),
                    examKey: Joi.string().required()
                }
            }
        },
        handler: function(request, reply) {
            return getObject(request)
            //fixme: change status code to something more significant
            .catch(e => reply(e.message).statusCode(429))
            .then(o => validateObject(o, cucumberSchema))
            .catch(e => reply(e.message).statusCode(429))
            .then(o => {
                emitter.emit('uploads/cucumber', {
                    assessmentKey: request.query.assessmentKey,
                    examKey: request.query.examKey,
                    subjectKey: request.query.subjectKey,
                    report: o
                });
                return reply().code(202);
            });
        }
    });
}
