var config = require('./app/config');
var harvesterApp = require('./app/api')(config);

module.exports = harvesterApp;
