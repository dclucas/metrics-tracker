module.exports = function () {
    const 
        chai = require('chai')
        expect = chai.expect,
        _ = require('lodash');
    chai.use(require('chai-subset'));
    
    this.Given(/^the system is up and running$/i,  function() {
        // no op here, as the server is started outside the suite
    });
        
    this.Then(/^I receive a (\d+) status code$/, function (statusCode) {
        expect(this.response.statusCode.toString()).to.equal(statusCode);
    });
};
