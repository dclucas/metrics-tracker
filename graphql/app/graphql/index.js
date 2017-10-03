'use strict'

const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const { GraphQLDateTime } = require('graphql-iso-date');
const casual = require('casual');
const requireText = require('require-text');
const data = require('../../setup/data');
// Construct a schema, using GraphQL schema language
const typeDefs = requireText('./schema.gql', require);

function createResolvers(repos, logger) {
    const { subject, metrics } = repos;
    return {
        DateTime: GraphQLDateTime,
        Query: {
            subject: (_, { id }) => subject.findById(id),
        },
    };
}

module.exports.createSchema = (repos, logger) => {
    const schema = makeExecutableSchema({
        typeDefs,
        resolvers: {
            DateTime: GraphQLDateTime
        }
    });
 
    return makeExecutableSchema({
        typeDefs,
        resolvers: createResolvers(repos, logger),
    });
}