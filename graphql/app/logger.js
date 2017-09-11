'use strict'

module.exports.createLogger = (config, pck) => {
    const logger = require('bunyan').createLogger({name:`${pck.name}:${pck.version}`});
    logger.level(config.logLevel);
    return logger;
}