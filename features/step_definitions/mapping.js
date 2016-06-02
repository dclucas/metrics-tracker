module.exports = function () {
    const
        chai = require('chai'),
        chaiSubset = require('chai-subset'),
        expect = chai.expect,
        cucumberMapper = require('../../app/utils/cucumber-mapper'),
        mapper = require('../../app/utils/general-mapper'),
        fixtures = {
            subject: {
                input: { collectionName: 'subjects', key: 1, relationships: undefined },
                output: { type: 'subjects', attributes: { key: 1 }, relationships: undefined }
            },
            assessment: {
                input: { collectionName: 'assessments', key: 1, relationships: [{ name: 'subject', type: 'subjects', id: 2 }] },
                output: { type: 'assessments', attributes: { key: 1 }, relationships: { subject: { data: { type: 'subjects', id: 2 } } } }
            }
        };
    chai.use(chaiSubset);
        
    this.Given(/^a\(n\) (.*) entity$/, function (entity) {
        this.fixture = fixtures[entity];
    });

    this.When(/^I map it with the mapResource method$/, function () {
        var i = this.fixture.input;
        this.result = mapper.mapResource(
            i.collectionName,
            i.key,
            i.relationships);
    });
    
    this.Then(/^I receive a correctly mapped entity$/, function () {
        expect(this.result).to.containSubset(this.fixture.output);
    });
    
    this.Given(/^a cucumber report object$/, function() {
        this.fixture = require('../fixtures/cucumber-json-report');
    });
    
    this.When(/^I map it with the mapCucumber method$/, function() {
        cucumberMapper.mapCucumber(this.fixture.request);
    });
    
    /*
    this.Then(/^I receive a correctly mapped set of entities$/, function() {
    });
    */
};
