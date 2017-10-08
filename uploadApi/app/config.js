var config = {};
config.port = process.env.PORT || 2426;
config.baseUri = process.env.BASE_URI || 'http://localhost:' + config.port;
config.logLevel = process.env.LOG_LEVEL || 'info';
module.exports = config;
