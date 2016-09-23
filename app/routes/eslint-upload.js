'use strict';
const Joi = require('joi');
const reqUtils = require('../utils/requestUtils');
const R = require('ramda');

//fixme: allow unknown fields and just require absolutely mandatory ones
const eslintSchema = Joi.array().items(Joi.object().keys({
    filePath: Joi.string().required(),
    errorCount: Joi.number().integer().required(),
    warningCount: Joi.number().integer().required(),
    messages: Joi.array().items(Joi.object().keys({
        ruleId: Joi.string().required(),
        severity: Joi.number().integer().required(),
        message: Joi.string().required(),
        line: Joi.number().integer(),
        column: Joi.number().integer(),
        nodeType: Joi.string(),
        source: Joi.string(),
        fix: Joi.object()
    })).required()
}));

module.exports = function (server, emitter) {
    server.route({
        method: 'POST',
        path: '/upload/eslint',
        config: {
            tags: ['upload'],
            payload: {
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
            return reqUtils.getObject(request, 'eslint')
            .then(o => reqUtils.validateObject(o, eslintSchema))
            .then(report => {
                emitter.emit(
                    'uploads/eslint',
                    R.assoc('report', report, R.pick(['subject', 'evaluation', 'evaluationTag'], request.query))
                );
                return reply().code(202);
            })
            // fixme: this will resolve even internal errors as 429's
            // break the initial processing (which returns 429 codes)
            // from the final one (which returns 5xx codes)
            .catch(e => {
                return reply(e.message).code(400);
            });
        }
    });
};
