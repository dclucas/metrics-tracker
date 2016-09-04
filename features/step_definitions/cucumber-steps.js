module.exports = function() {
    const 
        _ = require('lodash'),
        Promise = require('bluebird'),
        chai = require('chai'),
        expect = chai.expect,
        chaiSubset = require('chai-subset'),
        uuid = require('uuid');

    chai.use(chaiSubset);

    this.Given(/^a cucumber report file$/, function () {
        //this.fileContents = require('../fixtures/cucumber.json');
        this.filePath = '../fixtures/cucumber.json';
    });

    this.Given(/^new assessment, exam and subject keys$/, function () {
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

    this.Then(/^all relevant data gets created$/, function () {
        const
            expected = require('../fixtures/cucumber-api-resources.json'),
            fetch = (collection, key) =>
                this.getByKey(collection, key).then(r => JSON.parse(r.body)),
            checkExpectedArray = (actual, collection) => {
                expect(actual).to.containSubset(expected[collection]);
            },
            quickCheck = (collection, key) => fetch(collection, key).then(r => {
                expect(r.data, `${collection}.data.${key}`).to.exist;
                expect(r.data, `${collection}.data.${key}`).to.have.length.above(0);
                return r;
            }),
            // todo: yeah, I know
            checkChecks = (keys, check) => {
                Promise.all(_.map(keys, k => fetch('checks', k)))   
                .then(res => {
                    const r = _.filter(
                        _.flatMap(res, x => x.data), 
                        i => _.at(i, 'relationships.exam.data.id') == check.data[0].id
                    ); 
                    expect(r).to.have.length(2);
                    checkExpectedArray(r, 'checks');
                    return null;
                });
            },
            // fixme: this delay is not only hackish -- it's flaky
            delay = Promise.delay(1000),
            subjectP = delay.then(() => quickCheck('subjects', this.subjectKey)),
            assessmentP = delay.then(() => quickCheck('assessments', this.assessmentKey)),
            checksP = delay.then(() => quickCheck('exams', this.examKey));

        return Promise.all([
            subjectP,
            assessmentP,
            checksP,
            checksP.then(check => checkChecks(['API-endpoints', 'health-check'], check))
        ]);
    });
}