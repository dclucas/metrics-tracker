const bunyan = require('bunyan');

module.exports = bunyan.createLogger({name: "metrics-tracker"});
