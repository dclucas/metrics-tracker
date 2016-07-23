'use strict';

const Types = require('joi');

module.exports = function (server) {
    const 
        _ = require('lodash'),
        harvesterPlugin = server.plugins['hapi-harvester'],
        Promise = require('bluebird'),
        uuid = require('node-uuid'),
        mapper = require('../utils/general-mapper');

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
            payload.relationships = {}
            _.reduce(
                relationships, 
                (p, r) => p.relationships[r.name] = { data: { type: r.type, id: r.id } },
                payload
            );
        }
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
    
    function mapComponentAttributes(reportItem) {
        return { 
            key: reportItem.id,
            type: reportItem.keyword,
            uri: reportItem.uri,
            name: reportItem.name,
            description: reportItem.description,
            subcomponents: reportItem.elements? _.map(reportItem.elements, mapComponentAttributes) : undefined
        };
    }
    
    function mapStep(step, componentId) {
        // todo: consider a new endpoint (checks)
        // for these pass/fail situations
        return {
            _id: uuid.v4(),
            type: 'checks',
            attributes: {
                type: 'cucumber-step',
                status: step.result.status,
                duration: step.result.duration,
                details: step.name
            },
            relationships: {
                component: {
                    data: {
                        type: 'components',
                        id: componentId
                    }
                }
            }
        }    
    }
    
    function mapComponent(reportItem, subjectId, rootId) {
        var id = uuid.v4();
        return { 
            payload: { 
                _id: id, 
                type: 'component', 
                attributes: mapComponentAttributes(reportItem),
                relationships: {
                    subject: { data: { type: 'subjects', id: subjectId } },
                    parent: rootId? {} : undefined
                } 
            },
            steps: _.map(reportItem.step, (r) => mapStep(r, id))
        };
    }
    
    function mapComponentTree(reportItem, subjectId) {
        var rootId = uuid.v4();
        return _.concat(
            _.map(reportItem.elements, (r) => mapComponent(r, subjectId, rootId)),
            mapComponent(reportItem, subjectId));
    }
    
    function postCucumber(req, reply) {
        const attr = req.orig.payload.data.attributes;
        var subjectP = upsertResource('subjects', attr.subjectKey)
        var examP = subjectP.then(function(subject) {
            return upsertResource('assessments', attr.assessmentKey, [{name: 'subject', type: 'subjects', id: subject._id}]);  
        })
        .then(function(assessment) {;
            return upsertResource('exams', attr.examKey, [{name: 'assessment', type: 'assessments', id: assessment._id}]);
        });

        var componentsP = Promise.join(examP, subjectP, function(exam, subject) {
            const model = server.plugins['hapi-harvester'].adapter.models.components;
            var features = _.flatMap(attr.report, (r) => mapComponentTree(r, subject._id));
            return model.create(_.map(features, (f) => f.payload));         
        });
        
        var measurementsP = componentsP.then(function (components) { 
            
        });
        
        return componentsP.then(function(features) {
            return reply().code(202);
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