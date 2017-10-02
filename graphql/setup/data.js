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
    "BOOLEAN": () => casual.coin_flip,
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

/*
# Represents a subject goal for a given metric
type MetricsGoal {
    # Which metrics this goal relates to
    metrics: Metrics!
    # Desired value for the metrics
    value: Float
    # How to evaluate the desired value against the current one
    matchBy: MatchKind
    # How important (normalized) this goal is
    weight: Float
    # add matchWith <- how to compare the current value: current only (default), previous, previous N, mean, average, max
    # The subject that owns the goal
    subject: Subject
}
*/
/*
enum MatchKind {
    EQUALS
    NOT_EQUALS
    GREATER_THAN
    LESSER_THAN
    GREATER_OR_EQUAL
    LESSER_OR_EQUAL
}
*/
const goals = {
    standard: [
        { metrics: metrics.branchCoverage, value: .8,  matchBy: 'GREATER_OR_EQUAL'},
    ]
}

const subjects = {
    proj01: {
        _id: "PROJ-01",
        name: casual.title,
        description: casual.description,
        goals: goals.standard,
    },
}

const assessments = {
    proj01_171: createAssessments(subjects.proj01, 171),
    proj01_172: createAssessments(subjects.proj01, 172),
    proj01_173: createAssessments(subjects.proj01, 173),
    proj01_174: createAssessments(subjects.proj01, 174),
    proj01_175: createAssessments(subjects.proj01, 175),
}

module.exports = {
    subjects: R.values(subjects),
    assessments: R.values(assessments),
    metrics: R.values(metrics),
}