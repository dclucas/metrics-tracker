module.exports = function() {
    const 
        Promise = require('bluebird'),
        should = require('chai').should(),        
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
        const fetch = (c, k) => this.getByKey(c, k).then(r => JSON.parse(r.body));
        Promise.all([
            fetch('subjects', this.subjectKey),
            fetch('assessments', this.assessmentKey),
            fetch('exams', this.examKey),
        ])
        .spread((subject, assessment, exam) => {
            subject.data.should.not.be.undefined;
            assessment.data.should.not.be.undefined;
            exam.data.should.not.be.undefined;
            callback(null, 'pending');
        });
    });
}