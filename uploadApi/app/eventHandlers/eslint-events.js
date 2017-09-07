'use strict';
const logger = require('../utils/logger');
const R = require('ramda');
const cfg = require('../config');
const influx = require('influx')(cfg.influxUrl);
const getBasePos = require('../utils/getBasePos');

module.exports = function (server, emitter) {
    emitter.listen('uploads/eslint', report => {
        logger.trace('handling eslint upload event at influx processor');
        const timestamp = new Date();
        const basePos = getBasePos(R.pluck('filePath', report.report));
        const influxLines = 
            R.chain(file => ({
                subject: report.subject,
                evaluation: report.evaluation,
                evaluationTag: report.evaluationTag,
                time: timestamp,
                file: file.filePath.substring(basePos),
                errorCount: file.errorCount,
                warningCount: file.warningCount                
            }), 
            report.report);
        const metrics = ['errorCount', 'warningCount', 'time'];
        R.forEach(l => 
            influx.writePoint(
                'eslint', 
                R.pick(metrics, l), 
                R.omit(metrics, l),
                err => err? logger.error(err) : null), 
            influxLines);
    });     
};
