'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'measurements',
            attributes: {
                value: Types.number(),
                type: Types.string().required(),
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
