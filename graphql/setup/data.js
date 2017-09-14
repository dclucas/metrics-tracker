const casual = require('casual');
const moment = require('moment');
const R = require('ramda');

const metrics = {
    branchCoverage: {
        id: 'BRANCH_COVERAGE',
        name: "branch coverage",
        valueType: "FLOAT",
        optimizeFor: "MAX",
        normalized: true,
        category: "test",
    },
    passingTests: {
        id: 'PASSING_TESTS',
        name: "passing tests",
        valueType: "INT",
        optimizeFor: "MAX",
        normalized: false,
        category: "test",
    },
    skippedTests: {
        id: 'SKIPPED_TESTS',
        name: "skipped tests",
        valueType: "INT",
        optimizeFor: "MIN",
        normalized: false,
        category: "test",
    },
    failingTests: {
        id: 'FAILING_TESTS',
        name: "failing tests",
        valueType: "INT",
        optimizeFor: "MIN",
        normalized: false,
        category: "test",
    },
    testDuration: {
        id: 'TEST_DURATION',
        name: "test duration",
        valueType: "INT",
        optimizeFor: "MIN",
        normalized: false,
        category: "test",
        unit: "ms",
    },
    buildSucceeded: {
        id: "BUILD_SUCEEDED",
        name: "Successful builds",
        valueType: "BOOLEAN",
        optimizeFor: "MAX",
        normalized: false,
        category: "build",
    },
    buildDuration: {
        id: "BUILD_DURATION",
        name: "Build DURATION",
        valueType: "INT",
        optimizeFor: "MIN",
        normalized: false,
        category: "build",
    },
}

const valueGenerators = {
    "INT": () => casual.integer,
    "FLOAT": () => casual.random,
    "BOOLEAN": () => casual.coin_flip,
}
const createMeasurement = (metrics, goal) => ({
    metrics,
    value: valueGenerators[metrics.valueType](),
    goal,
})

const createAssessments = (subject) => ({
    id: `${subject.id}/BUILD-${casual.integer}`,
    createdOn: casual.date(format = moment.ISO_8601),
    type: "BUILD",
    measurements: [],
});

const subjects = {
    proj01: {
        id: "PROJ-01",
        name: casual.title,
        description: casual.description,
        metricsSummary: [],
        assessments: [],
        goals: [],
    }
}