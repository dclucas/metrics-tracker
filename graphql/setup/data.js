const casual = require('casual');
const moment = require('moment');
const R = require('ramda');

const metrics = {
    branchCoverage: {
        _id: 'BRANCH_COVERAGE',
        name: "branch coverage",
        valueType: "PERCENTAGE",
        optimizeFor: "MAX",
        category: "test",
    },
    statementCoverate: {
        _id: 'STATEMENT_COVERAGE',
        name: "statement coverage",
        valueType: "PERCENTAGE",
        optimizeFor: "MAX",
        category: "test",
    },
    methodCoverage: {
        _id: 'METHOD_COVERAGE',
        name: "method coverage",
        valueType: "PERCENTAGE",
        optimizeFor: "MAX",
        category: "test",
    },
    passingTests: {
        _id: 'PASSING_TESTS',
        name: "passing tests",
        valueType: "COUNT",
        optimizeFor: "MAX",
        group: "test.result.counts",
        category: "test",
    },
    skippedTests: {
        _id: 'SKIPPED_TESTS',
        name: "skipped tests",
        valueType: "COUNT",
        optimizeFor: "MIN",
        group: "test.result.counts",
        category: "test",
    },
    failingTests: {
        _id: 'FAILING_TESTS',
        name: "failing tests",
        valueType: "COUNT",
        optimizeFor: "MIN",
        group: "test.result.counts",
        category: "test",
    },
    testDuration: {
        _id: 'TEST_DURATION',
        name: "test duration",
        valueType: "INT",
        optimizeFor: "MIN",
        category: "test",
        unit: "ms",
    },
    buildSucceeded: {
        _id: "BUILD_SUCEEDED",
        name: "Successful builds",
        valueType: "BOOLEAN",
        optimizeFor: "MAX",
        category: "build",
    },
    buildDuration: {
        _id: "BUILD_DURATION",
        name: "Build DURATION",
        valueType: "INT",
        optimizeFor: "MIN",
        category: "build",
    },
}

const valueGenerators = {
    "PERCENTAGE": () => casual.random,
    "COUNT": () => casual.integer,
    "INT": () => casual.integer,
    "FLOAT": () => casual.random,
    "BOOLEAN": () => casual.coin_flip,
}

const createMeasurement = (metrics) =>
    R.merge({ 
        value: valueGenerators[metrics.valueType]() 
    });

const createAssessments = (subject) => ({
    _id: `${subject._id}/BUILD-${casual.integer()}`,
    //createdOn: casual.date(format = moment.ISO_8601),
    type: "BUILD",
    subjectId: subject._id,
    measurements: R.map(
        createMeasurement
    )(R.values(metrics)),
});

const subjects = {
    proj01: {
        _id: "PROJ-01",
        name: casual.title,
        description: casual.description,
        goals: [],
    },
}

const assessments = {
    proj01: createAssessments(subjects.proj01),
}

module.exports = {
    subjects: R.values(subjects),
    assessments: R.values(assessments),
}