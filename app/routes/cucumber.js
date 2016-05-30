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
        if (relationships) {
            /*payload.relationships = _.map(relationships, (r) => {
                return { [r.name]: { data: { type: r.type, id: r.id } } }
            });*/
            payload.relationships = {}
            _.reduce(
                relationships, 
                (p, r) => p.relationships[r.name] = { data: { type: r.type, id: r.id } },
                payload
            );
        }
        var x = { "title": "t" };
        var y = JSON.stringify(x.y = { "description": "d" });
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
                return new model(createPayload(collectionName, key, relationships)).save();
        });
    }
    
    function postCucumber(req, reply) {
        const attr = req.orig.payload.data.attributes;
        return upsertResource('subjects', attr.subjectKey)
        .then(function(subject) {
            return upsertResource('assessments', attr.assessmentKey, [{name: 'subject', type: 'subjects', id: subject._id}]);  
        })
        .then(function(assessment) {;
            return upsertResource('exams', attr.examKey, [{name: 'assessment', type: 'assessments', id: assessment._id}]);
        })
        .then(function(exam) {
            return reply(exam).code(201);
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