'use strict'

const { makeExecutableSchema } = require('graphql-tools');
const { GraphQLDateTime } = require('graphql-iso-date');

// Construct a schema, using GraphQL schema language
const typeDefs = `
scalar DateTime

interface Node {
	id: ID!
}

enum MetricsKind {
	BOOLEAN
	FLOAT
	NORMALIZED_FLOAT
}

type Metrics implements Node {
	id: ID!
	name: String!
	kind: MetricsKind!
	minimized: Boolean
}

interface BaseCollectedMetrics {
    metrics: Metrics!
}

type FloatCollectedMetrics implements Node BaseCollectedMetrics {
  id: ID!
  metrics: Metrics!
	value: Float!
}

type BooleanCollectedMetrics implements Node BaseCollectedMetrics {
  id: ID!
  metrics: Metrics!
	value: Boolean!
}

union CollectedMetrics = FloatCollectedMetrics | BooleanCollectedMetrics

type Exam implements Node {
	id: ID!
	createdOn: DateTime!
}

type Subject implements Node {
    id: ID!
    name: String
    description: String
    metricsSummary: [CollectedMetrics!]
}

type Query {
  hello: String
	subject(id: ID!): Subject
}
`;

// Provide resolver functions for your schema fields
const resolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    hello: (root, args, context) => {
      return 'Hello world!';
    },
    subject: () => ({
      id: "1",
      name: "test",
      descriptor: "",
      collectedMetrics: []
    })
  },
};

function createResolvers(repos, logger) {
    return resolvers;
}

module.exports.createSchema = (repos, logger) => {
    return makeExecutableSchema({
        typeDefs, 
        resolvers: createResolvers(repos, logger)
    });
}
