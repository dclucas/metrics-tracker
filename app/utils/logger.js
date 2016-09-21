const 
    bunyan = require('bunyan'),
    cfg = require('../config');

module.exports = bunyan.createLogger({
    name: "metrics-tracker",
    level: cfg.LogLevel
});
