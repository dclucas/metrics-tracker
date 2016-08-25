module.exports = function() {
    const uuid = require('uuid');
    this.Given(/^a cucumber report file$/, function () {
        this.fileContents = require('../fixtures/cucumber.json');
    });

    this.Given(/^a new assessment key$/, function () {
        this.assessmentKey = uuid.v4();
    });

    this.When(/^I send it to the cucumber upload endpoint$/, function () {
        //return this.doHttpRequest(`upload/cucumber?assessmentKey=${this.assessmentKey}`, "POST", this.fileContents);
        return this.uploadTo(`upload/cucumber?assessmentKey=${this.assessmentKey}`, this.fileContents);
    });    
}