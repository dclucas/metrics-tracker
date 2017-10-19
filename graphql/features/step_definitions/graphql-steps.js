const {defineSupportCode} = require('cucumber');
const { expect } = require('chai');
const client = require('graphql-client')({
    url: 'http://localhost:3001/graphql',
});

const queries = {
    'subject snapshot': `query {
        subject(id: "PROJ-01") {
          name
          description
          assessments {
            edges {
              node {
                id
              }
            }
          }
          goals {
            value
            matchBy
            weight
            metrics {
              id
            }
          }
          metricsSummary {
            metrics {
              name
              valueType
              optimizeFor
              normalized
              category
              unit
              group
            }
            assessment {
              id
              type
              createdOn
            }
            value
          }
        }
      }`,
};

defineSupportCode(function({Given, When, Then}) {
    Given('an existing subject with associated data', function () {
        this.variables = {};
    });

    When(/I run a (.*) query/, function (queryName) {
        const query = queries[queryName];

        const that = this;
        return client.query(query)
            .then(body => that.response = body);
    });

    Then('I receive a valid response', function () {
        // fixme: the only value of this test is to check data came as expected, as
        // there are easier ways to enforce contract expectations. either check the data
        // or kill this test
        expect(this.response).to.exist;
    });        
});
