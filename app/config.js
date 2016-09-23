var config = {};
config.port = process.env.PORT || 2426;
config.baseUri = process.env.BASE_URI || 'http://localhost:' + config.port;
config.logLevel = process.env.LOG_LEVEL || 'info';
config.influxUrl = process.env.INFLUX_URL || 'http://localhost:8086/metricsdb';
module.exports = config;
