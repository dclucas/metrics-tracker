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
    emitter.listen('uploads/cucumber', report => {
        logger.trace(`handling cucumber upload event at influx processor`);
        const timestamp = new Date();
        const influxLines = 
            R.chain(feature => 
                R.chain(scenario =>
                    R.chain(step => {
                        return {
                            subject: report.subject,
                            evaluation: report.evaluation,
                            evaluationTag: report.evaluationTag,
                            feature: feature.name,
                            scenario: scenario.name,
                            step: step.name,
                            line: Number(step.line),
                            status: step.result.status,
                            duration: step.result.duration,
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
