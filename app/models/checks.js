'use strict';

var Types = require('joi');

module.exports = function (server) {
    const 
        harvesterPlugin = server.plugins['hapi-harvester'],
        // todo: remove this copy-and-paste. looks like true recursion would break hapi swagger:
        // https://github.com/glennjones/hapi-swagger/issues/299
        innerCheckLeaf = Types.object().keys({                    
            key: Types.string(),
            description: Types.string(),
            type: Types.string(),
            duration: Types.number(),
            status: Types.string(),
        }),
        innerCheckSchema = innerCheckLeaf.keys({ innerChecks: Types.array().items(innerCheckLeaf) }),
        schema = {
            type: 'checks',
            attributes: {
                key: Types.string().required(),
                description: Types.string().required(),
                status: Types.string(),
                type: Types.string().required(),
                duration: Types.number(),
                innerChecks: Types.array().items(innerCheckSchema)
            },
            relationships: {
                exam: { data: {type: 'exams'} }
            }
        }

    harvesterPlugin.routes.all(schema).forEach(function (route) {
        server.route(route)
    })
}
