'use strict';

const 
    Emitter = require('./utils/emitter'),
    Hapi = require('hapi'),
    harvester = require('hapi-harvester'),
    Promise = require('bluebird'),
    Types = require('joi'),
    require_dir = require('require-directory'),
    _ = require('lodash');

module.exports = function (config) {
    const 
        adapter = harvester.getAdapter('mongodb'),
        server = new Hapi.Server(),
        emitter = new Emitter(server);

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
                route(server, emitter);
            })
            
            _.each(require_dir(module, './models'), model => {
                model(server, emitter);
            })

            _.each(require_dir(module, './eventHandlers'), handler => {
                handler(server, emitter);
            })

            server.start(function() {
                console.info('listening on port ' + server.info.port)
                resolve(server);            
            })
        })
    });
}
