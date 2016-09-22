Feature: lcov reports
    As an API client
    I want to upload lcov reports
    
Scenario: lcov report upload
    Given a lcov.info report file
    And an evaluation, evaluation tag and subject keys
    When I do a curl POST against the lcov upload endpoint
    Then I receive a success response
    And the corresponding metrics get created

Scenario: invalid report
    Given an invalid lcov.info report file
    And an evaluation, evaluation tag and subject keys
    When I do a curl POST against the lcov upload endpoint
    Then I receive an error status code
    And the response message contains details on the failed validation

Scenario Outline: missing querystring arguments
    Given a lcov.info report file
    And I am missing a(n) <param> parameter
    When I do a curl POST against the lcov upload endpoint
    Then I receive an error status code
    And the response message contains details on the missing arguments
Examples:
    |      param     |
    | evaluation     |
    | evaluation tag |
    | subject        |
