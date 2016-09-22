module.exports = function() {
    const 
        _ = require('lodash'),
        Promise = require('bluebird'),
        chai = require('chai'),
        expect = chai.expect,
        expectedMetrics = require('../fixtures/cucumber-influx-metrics.json'),
        chaiSubset = require('chai-subset'),
        uuid = require('uuid'),
        cfg = require('../../app/config'),
        influx = require('influx')(cfg.influxUrl),
        delay = Promise.delay(1000),
        that = this;

    chai.use(chaiSubset);

    this.Given(/^a ([\w\.]+) report file$/, function (report) {
        this.filePath = `../fixtures/reports/${report}`;
        this.reportKind = report;
    });

    this.Then(/^I receive a success response$/, function () {
        expect(this.response.statusCode).to.be.within(200,299);
    });

    this.Given(/^an invalid cucumber\.json report file$/, function () {
        this.filePath = '../fixtures/cucumber-invalid.json';
    });

    this.Then(/^I receive an error status code$/, function () {
        expect(this.response.statusCode).to.be.within(400, 499);
    });

    this.Then(/^the response message contains details on the failed validation$/, function () {
        expect(JSON.stringify(this.response.body)).to.match(/\bid\b.*\brequired/);
    });

    this.Given(/^I am missing a\(n\) (.*) parameter$/, function (param) {
        const params = {
            evaluation: 'test-eval',
            evaluationTag: '123',
            subject: 'test-subject'
        },
        createKVP = (key) => `${key}=${params[key]}`;
        this.missingKey = _.camelCase(param);
        this.queryString = _.reduce(
            _.keys(_.omit(params, this.missingKey)),
            (previous, current) => previous? `${previous}&${createKVP(current)}` : createKVP(current),
            ''
        );
    });

    this.Then(/^the response message contains details on the missing arguments$/, function () {
        expect(this.response.body).to.contain(this.missingKey);
    });

    this.Given(/^an evaluation, evaluation tag and subject keys$/, function () {
        this.evaluationTag = `tag-${uuid.v4()}`;
        this.queryString = `subject=test-subject-${uuid.v4()}&evaluation=test-eval-${uuid.v4()}&evaluationTag=${this.evaluationTag}`;
    });

    this.When(/^I do a curl POST against the (\w+) upload endpoint$/, function (endpoint) {
        const uri = `upload/${endpoint}?${this.queryString}`;
        const p = this.uploadTo(
            uri, 
            this.filePath,
            endpoint);
        return p
        .then(response => {
            this.response = response;
            return response;
        });
    });

    this.Then(/^the corresponding metrics get created$/, function (callback) {
        callback(null, 'pending');
        /*
        //todo: change this delay for something less flaky (such as watching SSE)
        return Promise.delay(2000).then(() => new Promise((resolve, reject) =>
            influx.query(`SELECT * FROM cucumber WHERE evaluationTag='${this.evaluationTag}'`,
                (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        expect(results).not.to.be.empty;
                        const metrics = results[0];
                        expect(metrics).not.to.be.empty;
                        expect(metrics).to.containSubset(expectedMetrics);
                        resolve(true);
                    }
                }
            )
        ))
        */
    });
}