const hapi = require('hapi');
const { forEach, keys } = require('ramda');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');

module.exports.createApp = (schema, config, routes, emitter, logger) => {
    const server = new hapi.Server({ debug: { request: '*' } });
    
    const { port } = config;
    
    server.connection({
        port,
    });
    
    server.register([{
        register: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema,
            },
            route: {
                cors: true
            }
        },
    }, {
        register: graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql',
            },
        },
    }]);

    forEach(k => {
        logger.info(`registering route ${k}`);
        routes[k](server, emitter);
    }, keys(routes));
    return server;
};
