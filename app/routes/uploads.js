'use strict';
const 
    Emitter = require('../utils/emitter'),
    emitter = new Emitter(),
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

function mapCucumberReport(object, assessmentKey, subjectKey, examKey) {
    return {
        assessment: {
            key: assessmentKey
        },
        subject: {
            key: subjectKey
        },
        exam: {
            key: examKey
        }
    };
}


/*
function saveReportResources(resources) {
    const
        adapter = server.plugins['hapi-harvester'].adapter,
        assessmentModel = adapter.models.assessments;
    return new assessmentModel(resources.assessment).save()
    .then(m => {
        return reply().code(202);
    });
}
*/

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
    function idempotentSave(payload, collection, filter) {
        const
            adapter = server.plugins['hapi-harvester'].adapter,
            model = adapter.models[collection],
            query = model.findOne(filter || {"attributes.key": payload.attributes.key});
        
        return query.exec()
        .then((doc) => {
            if (!doc) {
                // fixme: handle concurrent saves (multiple parallel calls might cause saves to be fired multiple times)
                return new model(payload).save();
            }
            return doc._doc;
        })
    }

    function handleSubject(report) {
        return idempotentSave({ attributes: { key: report.subjectKey }}, 'subjects');
    }

    function handleAssessment(report, subject) {
        return idempotentSave(
            { 
                attributes: { key: report.assessmentKey },
                relationships: {
                    subject: { data: { id: subject._id, type: 'subjects' } }
                }
            }, 
            'assessments', 
            { 
                'attributes.key': report.assessmentKey,
                'relationships.subject.data.id': subject._id 
            });
    }

    function handleExam(report, assessment) {
        return idempotentSave(
            { 
                attributes: { key: report.examKey },
                relationships: {
                    assessment: { data: { id: assessment._id, type: 'assessments' } }
                }
            }, 
            'exams', 
            { 
                'attributes.key': report.examKey,
                'relationships.assessment.data.id': assessment._id 
            });
    }

    emitter.listen('uploads/cucumber', report => {
        handleSubject(report)
        .then(s => handleAssessment(report, s))
        .then(a => handleExam(report, a));
    });

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
            .then(function(o) {
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
