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

    Then('I receive a valid response', function (callback) {
        expect(this.response).to.exist;
        console.log(this.data);
        // Write code here that turns the phrase above into concrete actions
        callback(null, 'pending');
    });        
});

/*
import ApolloClient, { HttpLink } from 'apollo-client-preset';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphql.example.com',
  }),
});

client.query({
    query: gql("{ hello }"),
})
    .catch(function(err){
        console.error(err);
    })
    .then(function(data){
        console.log(data);
    })
    ;
*/