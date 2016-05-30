module.exports = function () {
    const 
        chai = require('chai')
        expect = chai.expect,
        _ = require('lodash');
    chai.use(require('chai-subset'));
    
    this.Given(/^the system is up and running$/i,  function() {
        return this.server.then(function(server) {
            // checking the 'up' server flag
            expect(server.info.started).to.be.above(0);
            return server;
        });
    });
    
    this.When(/^I do a (\w+) against the \/(.*) endpoint$/, function (verb, endpoint) {
        var that = this;
        return this.doHttpRequest(endpoint, verb, null)
        .spread(function (response) {
            that.response = response;
            return response;
        });
    });
    
    this.Then(/^I receive a (\d+) status code$/, function (statusCode) {
        expect(this.response.statusCode.toString()).to.equal(statusCode);
    });
       
    this.When(/^I (\w+) it against the \/(.*) endpoint$/, function (verb, endpoint) {
        var that = this;
        return this.doHttpRequest(endpoint, verb, that.fixture.request)
        .spread(function (response) {
            that.response = response;
            return response;
        });
    });
    
    this.Then(/^a payload containing the newly created resource$/, function () {
        expect(this.response.body).to.containSubset(this.fixture.request);
    });
    
    this.Given(/^a (.*) payload$/, function (resource) {
        this.fixture = require('../fixtures/' + _.kebabCase(resource));
    });
};
