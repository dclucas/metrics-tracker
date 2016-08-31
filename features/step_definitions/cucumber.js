module.exports = function() {
    const 
        _ = require('lodash'),
        Promise = require('bluebird'),
        should = require('chai').should(),
        expect = require('chai').expect, 
        uuid = require('uuid');

    this.Given(/^a cucumber report file$/, function () {
        //this.fileContents = require('../fixtures/cucumber.json');
        this.filePath = '../fixtures/cucumber.json';
    });

    this.Given(/^a new assessment key$/, function () {
        this.subjectKey = "test-subject-" + uuid.v4();
        this.assessmentKey = "test-assessment-" + uuid.v4();
        this.examKey = "test-exam-" + uuid.v4();
    });

    this.When(/^I send it to the cucumber upload endpoint$/, function () {
        const p = this.uploadTo(
            `upload/cucumber?assessmentKey=${this.assessmentKey}&examKey=${this.examKey}&subjectKey=${this.subjectKey}`, 
            this.filePath);
        return p.then(response => {
            this.response = response;
            return response;
        });
    });

    this.Then(/^I receive a success response$/, function () {
        // no action
    });

    this.Then(/^all relevant data gets created$/, function (callback) {
        const 
            fetch = (c, k) => this.getByKey(c, k).then(r => JSON.parse(r.body));
            quickCheck = (c, k) => fetch(c, k).then(r => {
                expect(r.data, `${c}.data.${k}`).to.exist;
                expect(r.data, `${c}.data.${k}`).to.have.length.above(0);
                return r;
            }),
            // todo: yeah, I know
            checkCheck = (c,k,e) => {
                return quickCheck(c, k)
                .then(res => {
                    const r = _.filter(res.data, i => _.at(i, 'relationships.exam.data.id') == e.data[0].id); 
                    expect(r).to.have.length(1);
                    //todo: check mapping here
                    console.log(r);
                });
            },
            subjectP = quickCheck('subjects', this.subjectKey),
            assessmentP = quickCheck('assessments', this.assessmentKey),
            examsP = quickCheck('exams', this.examKey);

        Promise.all([
            subjectP,
            assessmentP,
            examsP,
            examsP.then(e => checkCheck('checks', 'API-endpoints', e)),
            examsP.then(e => checkCheck('checks', 'health-check', e)),
        ])
        .then((result) => {
            callback(null, 'pending');
        })
        .catch(callback);
    });
}