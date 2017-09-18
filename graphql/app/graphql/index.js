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
                            valueType: "PERCENTAGE",
                            optimizeFor: "MAX",
                            normalized: true
                        },
                        goal: {
                            value: .85,
                            matchBy: "GREATER_OR_EQUAL",          
                        },
                        value: .90,
                    },
                    {
                        metrics: {
                            id: "PASSING_TESTS",
                            name: "Passing tests",
                            valueType: "PERCENTAGE",
                            optimizeFor: "MAX",
                            normalized: true
                        },
                        goal: {
                            value: 1,
                            matchBy: "EQUALS",
                        },
                        value: .97,
                    },                    
                    {
                        metrics: {
                            id: "BUILD_SUCCEEDED",
                            name: "Build success",
                            valueType: "BOOLEAN",
                            optimizeFor: "MAX",
                            category: "build",
                        },
                        goal: {
                            value: 1,
                            matchBy: "EQUALS",
                        },
                        value: 1,
                    },                    
                    {
                        metrics: {
                            id: "BUILD_DURATION",
                            name: "Build duration",
                            valueType: "INT",
                            optimizeFor: "MIN",
                            unit: "ms",
                            category: "build",
                        },
                        goal: {
                            value: 60000,
                            matchBy: "LESSER_OR_EQUAL",
                        },
                        value: 27148,
                    },                   
                    {
                        metrics: {
                            id: "UNKNOWN_METRIC",
                            name: "Completely unknown metric",
                            valueType: "PERCENTAGE",
                            optimizeFor: "MIN",
                            category: "unknown",
                        },
                        goal: {
                            value: .82,
                            matchBy: "GREATER_OR_EQUAL",
                        },
                        value: .103,
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