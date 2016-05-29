'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'components',
            attributes: {
                key: Types.string().required()
            },
            relationships: {
                parent: { data: {type: 'components'} },
                subject: { data: {type: 'subjects'} }
            }
        }

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}
