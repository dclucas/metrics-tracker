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
    if (data.file) {
        return streamToString(data.file)
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
/*
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
            match: Joi.object().keys({ location: Joi.string() })
        }))
    }))
}))
*/

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
            return reply("ok");
            /*
            return getObject(request)
            .then(o => validateObject(o, cucumberSchema))
            .catch(e => reply(e.message).statusCode(429))
            .then(function(o) {
                console.log(o);
                return reply("done").code(202);
            });
            */
        }
    });
}
/*
var fs = require('fs');
var Hapi = require('hapi');

var server = Hapi.createServer('localhost', Number(process.argv[2] || 8080));

server.route({
    method: 'POST',
    path: '/submit',
    config: {

        payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data'
        },

        handler: function (request, reply) {
            var data = request.payload;
            if (data.file) {
                var name = data.file.hapi.filename;
                var path = __dirname + "/uploads/" + name;
                var file = fs.createWriteStream(path);

                file.on('error', function (err) { 
                    console.error(err) 
                });

                data.file.pipe(file);

                data.file.on('end', function (err) { 
                    var ret = {
                        filename: data.file.hapi.filename,
                        headers: data.file.hapi.headers
                    }
                    reply(JSON.stringify(ret));
                })
            }

        }
    }
});

server.start(function () {
    console.log('info', 'Server running at: ' + server.info.uri);
});

*/
/*
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
*/
