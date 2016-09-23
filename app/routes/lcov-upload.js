'use strict';
const Joi = require('joi');
const logger = require('../utils/logger');
const reqUtils = require('../utils/requestUtils');
const parse = require('lcov-parse');
const R = require('ramda');

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
                parse(s, function(err, report) {
                    if (err) {
                        logger.warn(err);
                        return reply(err).code(400);
                    }
                    else {
                        emitter.emit(
                            'uploads/lcov', 
                            R.assoc('report', report, R.pick(['subject', 'evaluation', 'evaluationTag'], request.query))
                        );

                        return reply().code(202);                        
                    }
                });
            });
        }
    });
};
