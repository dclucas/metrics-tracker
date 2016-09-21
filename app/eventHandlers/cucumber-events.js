'use strict';
const _ = require('lodash');
const fs = require('fs');
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid');
const logger = require('../utils/logger');
const R = require('ramda');
const cfg = require('../config');
const influx = require('influx')(cfg.influxUrl);

module.exports = function (server, emitter) {
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
            return doc;
        })
    }

    // todo: refactor the 3 functions below for a bit more DRYness
    function handleSubject(report) {
        return idempotentSave({ type: "subjects", attributes: { key: report.subjectKey }}, 'subjects');
    }

    function handleAssessment(report, subject) {
        return idempotentSave(
            { 
                type: "assessments",
                attributes: { key: report.assessmentKey },
                relationships: { subject: { data: { id: subject._id, type: 'subjects' } } }
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
                type: "exams",
                attributes: { key: report.examKey },
                relationships: { assessment: { data: { id: assessment._id, type: 'assessments' } } }
            }, 
            'exams', 
            { 
                'attributes.key': report.examKey,
                'relationships.assessment.data.id': assessment._id 
            });
    }

    function mapNullable(col, f) { return col? _.map(col, f) : undefined };

    function mapStep(d) {
        return {
            key: d.line,
            description: d.keyword + d.name,
            type: "step",
            duration: d.result.duration,
            status: d.result.status,
        };
    };

    const statusValues = {
        "failed": 0,
        "pending": 1,
        "passed": 2
    };

    function reduceStatus(col) { return _.minBy(_.map(col, 'status'), (s) => statusValues[s]); } 
    function reduceDuration(col) { return _.sumBy(col, 'duration'); }

    function mapScenario(d) {
        var steps = mapNullable(d.steps, mapStep);
        return {
            key: d.id,
            description: d.description,
            type: "scenario",
            innerChecks: steps,
            status: reduceStatus(steps),
            duration: reduceDuration(steps),
        };
    };

    function mapCheckAttributes(d) {
        var scenarios = mapNullable(d.elements, mapScenario);
        return {
            id: uuid.v4(),
            key: d.id,
            description: d.description,
            type: "feature",
            innerChecks: scenarios,
            status: reduceStatus(scenarios),
            duration: reduceDuration(scenarios),
        };
    };

    function mapCheck(entry, exam) {
        return {
            type: 'checks',
            attributes: mapCheckAttributes(entry),
            relationships: { exam: {data: {id: exam._doc._id } } },
        };
    };

    function handleCheck(element, exam) {
        var checkPayload = mapCheck(element, exam); 
        return idempotentSave(
            checkPayload,
            'checks',
            {
                'attributes.key': element.id,
                'relationships.exam.data.id': exam._id 
            }
        );        
    }

    function handleChecks(report, exam) {
        return Promise.map(report.report,
            (e) => handleCheck(e, exam));
    }

    emitter.listen('uploads/cucumber', report => {
        var subjectP = handleSubject(report);
        var assessmentP = subjectP.then(s => handleAssessment(report, s));
        var examP = assessmentP.then(a => handleExam(report, a));
        var checksP = examP.then(e => handleChecks(report, e));
    });

    function cucumberToInflux(reportHeader, reportRow) {
        console.log(reportRow);
        return reportRow;
    }

    emitter.listen('uploads/cucumber', report => {
        logger.trace(`handling cucumber upload event at influx processor`);
        const timestamp = new Date();
        const influxLines = 
            R.chain(feature => 
                R.chain(scenario =>
                    R.chain(step => {
                        return {
                            subject: report.subjectKey,
                            //evaluation: '',
                            //evaluationTag: '',
                            feature: feature.name,
                            scenario: scenario.name,
                            step: step.name,
                            line: step.line,
                            status: step.result.status,
                            duration: step.result.duration || null,
                            time: timestamp
                        } 
                    },
                    scenario.steps),
                feature.elements),
            report.report);

        R.forEach(l => 
            influx.writePoint(
                'cucumber', 
                R.pick(['status', 'duration', 'time'], l), 
                R.omit(['status', 'duration', 'time'], l),
                err => err? logger.error(err) : null), 
            influxLines);
    });     
}
