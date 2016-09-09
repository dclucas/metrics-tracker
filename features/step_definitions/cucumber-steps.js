module.exports = function() {
    const 
        _ = require('lodash'),
        Promise = require('bluebird'),
        chai = require('chai'),
        expect = chai.expect,
        expected = require('../fixtures/cucumber-api-resources.json'),
        chaiSubset = require('chai-subset'),
        uuid = require('uuid'),
        delay = Promise.delay(1000),
        that = this;

    chai.use(chaiSubset);

    generateKeys = function(target) {
        target.keys = {
            subjects: "test-subject-" + uuid.v4(),
            assessments: "test-assessment-" + uuid.v4(),
            exams: "test-exam-" + uuid.v4(),
            checks: ['API-endpoints', 'health-check']         
        }
    }

    generateExpected = function(target) {
        target.expected = {
            subjects: { type: 'subjects', attributes: { key: target.keys.subjects } },
            assessments: { type: 'assessments', attributes: { key: target.keys.assessments } },
            exams: { type: 'exams', attributes: { key: target.keys.exams } },
            checks: require('../fixtures/cucumber-api-resources').checks
        } 
    }

    this.Given(/^a cucumber report file$/, function () {
        this.filePath = '../fixtures/cucumber.json';
    });

    this.Given(/^new assessment, exam and subject keys$/, function () {
        generateKeys(this);
        generateExpected(this);
    });

    this.When(/^I send it to the cucumber upload endpoint$/, function () {
        const p = this.uploadTo(
            `upload/cucumber?assessmentKey=${this.keys.assessments || ''}&examKey=${this.keys.exams || ''}&subjectKey=${this.keys.subjects || ''}`, 
            this.filePath);
        return p
        .then(response => {
            this.response = response;
            return response;
        });
    });

    this.Then(/^I receive a success response$/, function () {
        // no action
    });

    this.fetch = (collection, key) => {
        return this.getByKey(collection, key).then(r => JSON.parse(r.body));
    }

    this.checkExpectedArray = (actual, collection) => {
        return expect(actual).to.containSubset(expected[collection]);
    }

    this.quickCheck = (collection, key) => { 
        return this.fetch(collection, key).then(r => {
            expect(r.data, `${collection}.data.${key}`).to.exist;
            expect(r.data, `${collection}.data.${key}`).to.have.length.above(0);
            return r;
        });
    };

    this.coreCheck = () => {
        const delay = Promise.delay(1000);
        return Promise.props({
            subject: delay.then(() => this.quickCheck('subjects', this.subjectKey)),
            assessment: delay.then(() => this.quickCheck('assessments', this.assessmentKey)),
            checks: delay.then(() => this.quickCheck('exams', this.examKey))
        });
    }

    this.checkChecks = (keys, check) => {
        return Promise.all(_.map(keys, k => fetch('checks', k)))   
        .then(res => {
            const r = _.filter(
                _.flatMap(res, x => x.data), 
                i => _.at(i, 'relationships.exam.data.id') == check.data[0].id
            ); 
            expect(r).to.have.length(2);
            checkExpectedArray(r, 'checks');
            return null;
        });
    }
 
    this.Then(/^all relevant data gets created$/, function () {
        const
            // todo: yeah, I know
            // fixme: this delay is not only hackish -- it's flaky
            delay = Promise.delay(1000),
            subjectP = delay.then(() => that.quickCheck('subjects', this.subjectKey)),
            assessmentP = delay.then(() => that.quickCheck('assessments', this.assessmentKey)),
            checksP = delay.then(() => that.quickCheck('exams', this.examKey));
        
        that = this;

        return Promise.all([
            subjectP,
            assessmentP,
            checksP,
            checksP.then(check => checkChecks(['API-endpoints', 'health-check'], check))
        ]);
    });

    this.Given(/^an existing set of assessment, exam and subject keys$/, function () {
        this.expected = require('../fixtures/cucumber-existing-resources');
        this.keys = {
            assessments: this.expected.assessments.attributes.key,
            exams: this.expected.exams.attributes.key,
            subjects: this.expected.subjects.attributes.key,
            checks: _.map(this.expected.checks, 'attributes.key')
        }
        return Promise.map(_.values(_.flatMap(this.expected)), this.upsertResource);
    });


    this.Then(/^the existing data is not touched$/, function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    this.Given(/^an invalid cucumber report file$/, function () {
        this.filePath = '../fixtures/cucumber-invalid.json';
    });

    this.Then(/^I receive an error status code$/, function (callback) {
        callback(null, 'pending');
        //expect(this.response.statusCode).to.be.within(400, 499);
    });

    this.Then(/^the response message contains details on the failed validation$/, function () {
        expect(JSON.stringify(this.response.body)).to.match(/\bid\b.*\brequired/);
    });

    this.Given(/^I am missing a\(n\) (.*) key$/, function (resource) {
        generateKeys(this);
        this.missingKey = `${resource}Key`;
        delete this[this.missingKey];
    });

    this.Then(/^the response message contains details on the missing arguments$/, function () {
        expect(this.response.body).to.contain(this.missingKey);
    });

    this.Then(/^the following data gets created:$/, function (table) {
        const resources = _.flatMap(table.rows());
        const coreP = Promise.map(
            _.filter(resources, n => n !== 'checks'),
            (resourceName) =>  {
                var key = this.keys[resourceName];
                var expected = this.expected[resourceName];
                return delay
                .then(() => this.getByKey(resourceName, this.keys[resourceName]))
                .then(response => JSON.parse(response.body))
                .then(body => {
                    expect(body.data[0], `${resourceName}.data.${key}`).to.containSubset(expected);
                    return { key: resourceName, val: body.data[0]};
                })
            }
        )
        .then(payloads => _.zipObject(_.map(payloads, 'key'), _.map(payloads, 'val')));

        if (_.includes(resources, 'checks')) {
            return coreP.then(coreResources => {
                return Promise.map(this.keys.checks,
                    (key) => {
                        // i => _.at(i, 'relationships.exam.data.id') == check.data[0].id
                        return this.getByKey('checks', key)
                        .then(response => JSON.parse(response.body))
                        .then(body => {
                            return _.first(
                                body.data, 
                                i => _.at(i, 'relationships.exam.data.id') == coreResources.exams.id);
                        })
                    })
                .then(checks => {
                    return Promise.map(this.expected.checks, e => {
                        const a = _.find(checks, c => c.attributes.key == e.attributes.key);
                        expect(a).to.exist;
                        expect(a).to.containSubset(_.omit(e, ['relationships', '_id']));
                        return e;
                    });
                });
            })
        }
        else {
            return coreP;
        }
    });

    this.Then(/^the following data is not touched:$/, function (table, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });    
}