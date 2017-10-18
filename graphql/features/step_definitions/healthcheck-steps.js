var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then}) {
    Given('the system is up and running', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    When('I do a GET against the /healthcheck endpoint', function (callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    Then('I receive a {int} status code', function (int, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });

    Then('a payload containing a {string} status', function (string, callback) {
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });
});