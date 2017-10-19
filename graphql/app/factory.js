'use strict';

const requireDir = require('require-dir');
const routes = requireDir('./routes');
const emitter = require('./utils/emitter');
const pck = require('../package');
const config = require('./config');
const logger = require('./logger').createLogger(config, pck);
const repos = {
    subject: require('./repos/mongo').createRepo('subjects', config, logger),
};
const schema = require('./graphql').createSchema(repos, logger);
const app = require('./index').createApp(schema, config, routes, emitter, logger);

module.exports = {
    resolveConfig: () => config,
    resolveApp : () => app,
    resolveLogger: () => logger,
};