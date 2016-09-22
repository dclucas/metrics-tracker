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
//todo: refactor these methods into util functions
function getString(request) {
    const data = request.payload;
    if (data.lcov) {
        return streamToString(data.lcov)
    }
    //todo: reject this with a clear message (and validate it through a test)
    return Promise.reject();
}

module.exports = function (server, emitter) {
    server.route({
        method: 'POST',
        path: '/upload/lcov',
        config: {
            tags: ['upload'],
            payload: {
                //allow: ['multipart/form-data'],
                parse: true,
                output: 'stream'
            },
            validate: {
                query: {
                    evaluation: Joi.string().min(1).required(),
                    evaluationTag: Joi.string().min(1).required(),
                    subject: Joi.string().min(1).required()
                }
            }
        },
        handler: function(request, reply) {
            return getString(request)
            .then(s => {
                console.log(s);
                return reply().code(202);
            })
            /*
            return getObject(request)
            .then(o => validateObject(o, lcovSchema))
            .then(o => {
                emitter.emit('uploads/lcov', {
                    assessmentKey: request.query.assessmentKey,
                    examKey: request.query.examKey,
                    subjectKey: request.query.subjectKey,
                    //todo: convert this into a `pick` command
                    subject: request.query.subject,
                    evaluation: request.query.evaluation,
                    evaluationTag: request.query.evaluationTag,
                    report: o
                });
                return reply().code(202);
            })
            // fixme: this will resolve even internal errors as 429's
            // break the initial processing (which returns 429 codes)
            // from the final one (which returns 5xx codes)
            .catch(e => {
                return reply(e.message).code(400);
            });
            */
        }
    });
}
