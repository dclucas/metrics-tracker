'use strict';
const logger = require('../utils/logger');
const R = require('ramda');
const cfg = require('../config');
const influx = require('influx')(cfg.influxUrl);

function getLastMatch(s1, s2) {
    var i = 0;
    for (; i < Math.min(s1.length, s2.length); ++i) {
        if (s1[i] !== s2[i]) break;
    }

    return i;
}

module.exports = function (server, emitter) {
    emitter.listen('uploads/lcov', report => {
        logger.trace('handling lcov upload event at influx processor');
        const timestamp = new Date();
        const basePos = R.reduce(
            (accum, val) => ({ 
                accum: accum.accum? Math.min(accum.accum, getLastMatch(accum.val, val)) : val.length,
                val: val 
            }),
            {},
            R.pluck('file', report.report)
        );
        const influxLines = R.map(f => ({ 
            subject: report.subject, 
            evaluation: report.evaluation, 
            evaluationTag: report.evaluationTag, 
            time: timestamp,
            file: f.file.substring(basePos.accum),
            branchesHits: f.branches.hit,
            branchesFound: f.branches.found,
            linesHits: f.lines.hit,
            linesFound: f.lines.found,
            functionsHits: f.functions.hit,
            functionsFound: f.functions.found
        }), 
            report.report);
        const metrics = ['branchesHits', 'branchesFound', 'linesHits', 'linesFound', 'functionsHits', 'functionsFound', 'time'];
        R.forEach(l => 
            influx.writePoint(
                'coverage', 
                R.pick(metrics, l), 
                R.omit(metrics, l),
                err => err? logger.error(err) : null), 
            influxLines);
    });     
};
