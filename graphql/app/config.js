const config = {
    port: process.env.PORT || 3001,
    logLevel: process.env.LOG_LEVEL || 'debug',
    mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/metrics'
};

module.exports = config;