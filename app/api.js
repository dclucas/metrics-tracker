'use strict';

const 
    Hapi = require('hapi'),
    harvester = require('hapi-harvester'),
    Promise = require('bluebird'),
    Types = require('joi'),
    require_dir = require('require-directory'),
    _ = require('lodash');

module.exports = function (config) {
    const adapter = harvester.getAdapter('mongodb')
    const server = new Hapi.Server()
    server.connection({port: config.port})
    
    return new Promise((resolve) => {
        server.register(
        [{
        register: harvester,
        options: {
            adapter: adapter(config.connectionString)
            } 
        }], () => {
            _.each(require_dir(module, './routes'), route => {
                route(server);
            })
            
            _.each(require_dir(module, './models'), model => {
                model(server);
            })

            server.start(function() {
                console.info('listening on port ' + server.info.port)
                resolve(server);            
            })
        })
    });
}
