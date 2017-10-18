const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;
const chaiSubset = require('chai-subset');
const uuid = require('uuid');
const measurements = {
    'cucumber.json': 'cucumber',
    'lcov.info': 'coverage',
    'eslint.json': 'eslint'
};

module.exports = function() {
    chai.use(chaiSubset);

    this.Given(/^a ([\w\.]+) report file$/, function (report) {
        this.filePath = `../fixtures/reports/${report}`;
        this.reportKind = report;
        this.expectedMeasurements = require(`../fixtures/expectedMeasurements/${measurements[report]}.json`);
    });

    this.Then(/^I receive a success response$/, function () {
        expect(this.response.statusCode).to.be.within(200,299);
    });

    this.Given(/^an invalid ([\w\.]+) report file$/, function (report) {
        this.filePath = `../fixtures/invalidReports/${report}`;
        this.reportKind = report;
    });

    this.Then(/^I receive an error status code$/, function () {
        expect(this.response.statusCode).to.equal(400);
    });

    this.Then(/^the response message contains details on the failed validation$/, function () {
        if (this.reportKind === 'cucumber.json') {
            expect(JSON.stringify(this.response.body)).to.match(/\bid\b.*\brequired/);
        } else if (this.reportKind === 'lcov.info') {
            expect(JSON.stringify(this.response.body)).to.match(/Failed to parse string/);
        } else {
            expect(JSON.stringify(this.response.body)).to.match(/\bfilePath\b.*\brequired/);
        }
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
        this.queryString = `subject=test-subject&evaluation=test-eval&evaluationTag=${this.evaluationTag}`;
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
};