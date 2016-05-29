'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'assessments',
            attributes: {
                key: Types.string().required(),
                description: Types.string().required()
            }
        }

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}
