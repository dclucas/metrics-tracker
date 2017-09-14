'use strict'

const R = require('ramda');
/*
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
    kind: String
}

type Subject implements Node {
    id: ID!
    name: String
    description: String
    metricsSummary: [CollectedMetrics!]
}
*/
const collections = {
    subjects: [
        { id: "PROJECT-01", name: "project 01", metricsSummary: [], exams: [] },
    ],
    exams: [
        { id: "BUILD-PROJECT-01-123", kind: "build", createdOn: "2017-09-12" }
    ]
}
    
function createRepo(colName) {
    const collection = collections[colName];
    return {
        find: () => { collection },
        findById: (id) => { R.find(i => i.id === id, collection) },
        add: (entry) => { collections[colName] = R.append(entry, collection) },
        delete: (id) => { collections[colName] = R.omit(i => i.id === id, collection) },
        update: () => {},
    }
}

const repos = {}

module.exports = repos;