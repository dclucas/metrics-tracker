'use strict';

const Types = require('joi');

module.exports = function (server) {
    const harvesterPlugin = server.plugins['hapi-harvester'];
    const uuid = require('node-uuid');
    const _ = require('lodash');

    const cucumberSchema = Types.object().keys({
        data: Types.object().keys({
            type: 'cucumberExams',
            attributes: Types.object({
                subjectKey: Types.string().required(),
                assessmentKey: Types.string().required(),
                examKey: Types.string().default('cucumber'),
                report: Types.array().items(Types.object().keys({
                    id: Types.string().required(),
                    name: Types.string().required(),
                    description: Types.string(),
                    line: Types.number().integer(),
                    keyword: Types.string(),
                    uri: Types.string(),
                    elements: Types.array().items(Types.object().keys({
                        name: Types.string().required(),
                        id: Types.string().required(),
                        line: Types.number().integer(),
                        keyword: Types.string(),
                        description: Types.string(),
                        type: Types.string().required(),
                        steps: Types.array().items(Types.object().keys({
                            name: Types.string(),
                            line: Types.number().integer(),
                            keyword: Types.string(),
                            result: Types.object().keys({
                                status: Types.string(),
                                duration: Types.number().integer()
                            }),
                            match: Types.object().keys({ location: Types.string() })
                        }))
                    }))
                }))
            })
        }).required()
    })

    function createPayload(collectionName, key, relationships) {
        var payload = { _id: uuid.v4(), type: collectionName, attributes: { key: key } };
        return payload;
    }

    function upsertResource(collectionName, key, relationships) {
        const adapter = server.plugins['hapi-harvester'].adapter;
        const model = adapter.models[collectionName];
        return model.findOne( { 'attributes.key': key } )
        .then( function(doc) {
            if (doc) 
                return doc;
            else
                return new model(createPayload(key, relationships)).save();
        });
    }
    
    // "relationships": { "photographer": { "data": { "type": "people", "id": "9" } } }    
    function postCucumber(req, reply) {
        const attr = req.orig.payload.data.attributes;
        return upsertResource('subjects', attr.subjectKey, null)
        .then(function(subject) {
            return upsertResource('assessments', attr.assessmentKey, null);  
        })
        .then(function(assessment) {;
            return upsertResource('exams', attr.examKey, null);
        })
        .then(function(exam) {
            return reply(exam);
        });
    }

    server.route({
        method: 'POST',
        path: '/exams/cucumber',
        handler: postCucumber,
        config: {
            validate: { payload: cucumberSchema },
            tags: ['api'],
            payload: {
                allow: ['application/json', 'application/vnd.api+json']
            }
        }
    });
}