Feature: Report uploads
    As an API client
    I want to upload code quality reports
    
Scenario Outline: valid report upload
    Given a <report> report file
    And an evaluation, evaluation tag and subject keys
    When I do a curl POST against the <endpoint> upload endpoint
    Then I receive a success response
    And the corresponding metrics get created
    Examples:
    | report        | endpoint |
    | cucumber.json | cucumber |
    | lcov.info     | lcov     |
    | eslint.json   | eslint   |

Scenario Outline: invalid report
    Given an invalid <report> report file
    And an evaluation, evaluation tag and subject keys
    When I do a curl POST against the <endpoint> upload endpoint
    Then I receive an error status code
    And the response message contains details on the failed validation
    Examples:
    | report        | endpoint |
    | cucumber.json | cucumber |
    | lcov.info     | lcov     |
    | eslint.json   | eslint   |

Scenario Outline: missing querystring arguments
    Given a <report> report file
    And I am missing a(n) <param> parameter
    When I do a curl POST against the <endpoint> upload endpoint
    Then I receive an error status code
    And the response message contains details on the missing arguments
Examples:
    Examples:
    | report        | endpoint | param          |
    | cucumber.json | cucumber | evaluation     |
    | cucumber.json | cucumber | evaluation tag |
    | cucumber.json | cucumber | subject        |
    | lcov.info     | lcov     | evaluation     |
    | lcov.info     | lcov     | evaluation tag |
    | lcov.info     | lcov     | subject        |
    | eslint.json   | eslint   | evaluation     |
    | eslint.json   | eslint   | evaluation tag |
    | eslint.json   | eslint   | subject        |
