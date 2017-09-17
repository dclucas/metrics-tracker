'use strict'

const { makeExecutableSchema, addMockFunctionsToSchema } = require('graphql-tools');
const { GraphQLDateTime } = require('graphql-iso-date');
const casual = require('casual');
const requireText = require('require-text');
const data = require('../../setup/data');
// Construct a schema, using GraphQL schema language
const typeDefs = requireText('./schema.gql', require);

function createResolvers(repos, logger) {
    return {
        DateTime: GraphQLDateTime,
        Query: {
            subject: () => ({
                id: "1",
                name: "test",
                descriptor: "",
                collectedMetrics: []
            })
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
    addMockFunctionsToSchema({
        schema,
        mocks: {
            DateTime: () => '2017-09-13T10:15:30Z',
            Subject: () => ({
                name: casual.title,
                description: casual.description,
                metricsSummary: [{
                        metrics: {
                            id: "BRANCH_COVERAGE",
                            name: "Branch coverage",
                            valueType: "FLOAT",
                            optimizeFor: "MAX",
                            normalized: true
                        },
                        goal: {
                            value: casual.random,
                            matchBy: "GREATER_OR_EQUAL",                            
                        },
                        value: casual.random,
                    },

                ]
            })
        }
    });
    return schema;
    return makeExecutableSchema({
        typeDefs,
        resolvers: createResolvers(repos, logger),
    });
}