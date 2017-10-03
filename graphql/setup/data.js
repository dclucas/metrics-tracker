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
    "COUNT": () => casual.integer(0),
    "INT": () => casual.integer(0),
    "FLOAT": () => casual.double(0),
    "BOOLEAN": () => casual.coin_flip? 1 : 0,
}

const getGoalMetrics = (metrics, subject) => R.find(g => g.metrics._id === metrics._id, R.propOr([], 'goals', subject));

const createMeasurement = (metrics, subject) => {
    const res = R.merge({ 
        value: valueGenerators[metrics.valueType]() 
        }, { metrics } );
    const goal = getGoalMetrics(metrics, subject);
    return goal? 
        R.merge(res, { goal: R.omit('metrics', goal) })
        : res;
}

const createAssessments = (subject, tag) => ({
    _id: `${subject._id}/BUILD-${tag}`,
    //createdOn: casual.date(format = moment.ISO_8601),
    type: "BUILD",
    subjectId: subject._id,
    measurements: R.map(
        m => createMeasurement(m, subject)
    )(R.values(metrics)),
});

const goals = {
    standard: [
        { metrics: metrics.branchCoverage, value: .8,  matchBy: 'GREATER_OR_EQUAL', weight: 0.8},
        { metrics: metrics.buildDuration, value: 60000,  matchBy: 'LESSER_OR_EQUAL', weight: 0.2},
        { metrics: metrics.buildSucceeded, value: 1,  matchBy: 'EQUALS', weight: 1.0},
        { metrics: metrics.failingTests, value: 0,  matchBy: 'EQUALS', weight: 1.0},
    ]
}

const assessments = {
    proj01_171: createAssessments({ _id: "PROJ-01", goals: goals.standard }, 171),
    proj01_172: createAssessments({ _id: "PROJ-01", goals: goals.standard }, 172),
    proj01_173: createAssessments({ _id: "PROJ-01", goals: goals.standard }, 173),
    proj01_174: createAssessments({ _id: "PROJ-01", goals: goals.standard }, 174),
    proj01_175: createAssessments({ _id: "PROJ-01", goals: goals.standard }, 175),
}

const subjects = {
    proj01: {
        _id: "PROJ-01",
        name: casual.title,
        description: casual.description,
        goals: goals.standard,
        //metricsSummary: createAssessments({ _id: "PROJ-01", goals: goals.standard }, 175).measurements,
        metricsSummary: 
            R.map(
                R.merge(
                    { assessment: R.omit('measurements', assessments.proj01_175) }
                ),
                assessments.proj01_175.measurements
            ),
    },
}

module.exports = {
    subjects: R.values(subjects),
    assessments: R.values(assessments),
    metrics: R.values(metrics),
}