'use strict';

const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLDateTime } = require('graphql-iso-date');
const requireText = require('require-text');
const typeDefs = requireText('./schema.gql', require);

function createResolvers(repos) {
    const { subject } = repos;
    return {
        DateTime: GraphQLDateTime,
        Query: {
            subject: (_, { id }) => subject.findById(id),
        },
    };
}

module.exports.createSchema = (repos, logger) => {
    return makeExecutableSchema({
        typeDefs,
        resolvers: createResolvers(repos, logger),
    });
};