var URL = require('url');
var config = {};
config.connectionString = process.env.MONGODB_URL || process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/metricsTracker';
config.oplogConnectionString = process.env.MONGODB_OPLOG_URL || 'mongodb://127.0.0.1:27017/local';
config.port = process.env.PORT || 2426;
config.baseUri = process.env.BASE_URI || 'http://localhost:' + config.port;
module.exports = config;
