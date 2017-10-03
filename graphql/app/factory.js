'use strict'

const pck = require('../package');
const config = require('./config');
const logger = require('./logger').createLogger(config, pck);
const repos = {
    subject: require('./repos/mongo').createRepo('subjects', config, logger),
};
const schema = require('./graphql').createSchema(repos, logger);
const app = require('./index').createApp(schema);

module.exports = {
    resolveConfig: () => config,
    resolveApp : () => app,
    resolveLogger: () => logger,
}