module.exports = function() {
    const uuid = require('uuid');
    this.Given(/^a cucumber report file$/, function () {
        //this.fileContents = require('../fixtures/cucumber.json');
        this.filePath = '../fixtures/cucumber.json';
    });

    this.Given(/^a new assessment key$/, function () {
        this.assessmentKey = uuid.v4();
    });

    this.When(/^I send it to the cucumber upload endpoint$/, function () {
        const p = this.uploadTo(`upload/cucumber?assessmentKey=${this.assessmentKey}`, this.filePath);
        return p.then(response => {
            this.response = response;
            return response;
        });
    });

    this.Then(/^I receive a success response$/, function () {
        // no action
    });

    this.Then(/^all relevant data gets created$/, function (callback) {
        callback(null, 'pending');
    });
}