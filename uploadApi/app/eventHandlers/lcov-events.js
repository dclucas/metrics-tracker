'use strict';
const logger = require('../utils/logger');
const R = require('ramda');
const cfg = require('../config');
const influx = require('influx')(cfg.influxUrl);
const getBasePos = require('../utils/getBasePos');

function calcCoverage(metric) {
    return metric.found? metric.hit / metric.found : 1.0;
}

module.exports = function (server, emitter) {
    emitter.listen('uploads/lcov', report => {
        logger.trace('handling lcov upload event at influx processor');
        const timestamp = new Date();
        const basePos = getBasePos(R.pluck('file', report.report));
        const influxLines = R.map(f => ({ 
            subject: report.subject, 
            evaluation: report.evaluation, 
            evaluationTag: report.evaluationTag, 
            time: timestamp,
            file: f.file.substring(basePos),
            branchesHits: f.branches.hit,
            branchesFound: f.branches.found,
            branchesCoverage: calcCoverage(f.branches),
            linesHits: f.lines.hit,
            linesFound: f.lines.found,
            linesCoverage: calcCoverage(f.lines),
            functionsHits: f.functions.hit,
            functionsFound: f.functions.found,
            functionsCoverage: calcCoverage(f.lines)
        }), 
            report.report);
        const metrics = ['branchesHits', 'branchesFound', 'linesHits', 'linesFound', 'functionsHits', 'functionsFound', 'time', 'branchesCoverage', 'linesCoverage', 'functionsCoverage'];
        R.forEach(l => 
            influx.writePoint(
                'coverage', 
                R.pick(metrics, l), 
                R.omit(metrics, l),
                err => err? logger.error(err) : null), 
            influxLines);
    });     
};
