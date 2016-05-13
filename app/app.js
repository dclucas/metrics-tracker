'use strict';

const Hapi = require('hapi'),
      server = new Hapi.Server({}),
      hapiHarvester = require('hapi-harvester'),
      adapter = hapiHarvester.getAdapter('mongodb'),
      config = require('./config'),
      require_dir = require('require-directory'),
      R = require('ramda');

server.connection({port: config.port});
var plugins = [
    //susie, inert, vision,
    {
        register: hapiHarvester,
        options: {
            adapter: adapter(config.connectionString)
        }
    },
    {
        register: require('hapi-swagger'),
        options: {
            info: {
                title: 'metrics-tracker',
                version: '0.0.1'
            }
        }
    }
];

server.register(plugins, startServer);

function startServer() {
    server.start(() => {
        loadResources(server);
        console.log('Server running at:', server.info.uri);
    })
}

function loadResources(server) {
    var resources = require_dir(module, './resources');
    R.forEach(resource => {
        resource(server);
    }, resources);
}

module.exports = server;