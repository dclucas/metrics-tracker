module.exports = function () {
    const expect = require('chai').expect;
        
    this.Then(/^a payload containing a 'green' status$/, function () {
        var payload = JSON.parse(this.response.body);
        expect(payload.status).to.equal('green');
    });    
};
