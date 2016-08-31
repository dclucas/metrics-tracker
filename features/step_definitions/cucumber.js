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
                expect(r.data, `${c}.data`).to.be.exist;
                expect(r.data, `${c}.data`).to.have.length.above(0);
                return r;
            }),
            // todo: yeah, I know
            checkCheck = (c,k,s) => {
                return quickCheck(c, k)
                .then(res => {
                    const r = _.filter(res.data, i => i.relationships.subject.data.id == s.data[0].id); 
                    expect(r).to.have.length(1);
                    //todo: check mapping here
                    console.log(r);
                });
            },
            subjectP = quickCheck('subjects', this.subjectKey);

        Promise.all([
            subjectP,
            quickCheck('assessments', this.assessmentKey),
            quickCheck('exams', this.examKey),
            subjectP.then(s => checkComponent('checks', 'API-endpoints', s)),
            subjectP.then(s => checkComponent('checks', 'health-check', s)),
        ])
        .then((result) => {
            callback(null, 'pending');
        })
        .catch(callback);
    });
}