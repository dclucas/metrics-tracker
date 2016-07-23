'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'checks',
            attributes: {
                status: Types.string(),
                type: Types.string().required(),
                duration: Types.number(),
                name: Types.string()
            },
            relationships: {
                exam: { data: {type: 'exams'} },
                component: { data: {type: 'components'} }
            }
        }

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}
