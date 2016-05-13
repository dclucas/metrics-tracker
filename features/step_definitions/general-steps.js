module.exports = function () {
    var that = this;
    
    this.Given(/^(a|an) (.*) payload$/i,  function(dummy, resource_name) {
        const fixtures = require('../fixtures/projects.json')
            
        this.fixture = fixtures[resource_name]; 
    });
    
    this.When(/^I do a (.*) against the \/(.*)\/ endpoint$/i, function(verb, endpoint) {
        return this.doHttpRequest(endpoint, verb, this.fixture.payload)
        .then(function(result) {
            this.response = result;
        }); 
    });
};
