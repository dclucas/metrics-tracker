'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        schema = {
            type: 'exams',
            attributes: {
                key: Types.string().required()
            },
            relationships: {
                assessment: { data: {type: 'assessmentss'} }                     
            }
        }

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}
