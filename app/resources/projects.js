'use strict';

const Types = require('joi');

module.exports = function (server) {
    const harvesterPlugin = server.plugins['hapi-harvester']
    const schema = {
        type: 'features',
        attributes: {
            name: Types.string().required().description('Project name (friendly version)'),
            key: Types.string().required().description('Unique project key')
        }
    };
    
    server.route(harvesterPlugin.routes['get'](schema));
    server.route(harvesterPlugin.routes['getById'](schema));
    server.route(harvesterPlugin.routes['post'](schema));
    //server.route(harvesterPlugin.routes['getChangesStreaming'](schema));
}