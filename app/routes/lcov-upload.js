'use strict';
const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid');
const logger = require('../utils/logger');
const reqUtils = require('../utils/requestUtils');
const parse = require('lcov-parse');

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
            return reqUtils.getString(request, 'lcov')
            .then(s => {
                parse(s, function(err, data) {
                    if (err) {
                        logger.warn(err);
                        return reply(err).code(400);
                    }
                    else {
                        emitter.emit('uploads/lcov', {
                            subject: request.query.subject,
                            evaluation: request.query.evaluation,
                            evaluationTag: request.query.evaluationTag,
                            report: data
                        });

                        return reply().code(202);                        
                    }
                });
            })
        }
    });
}
