Feature: Cucumber reports
    As an API client
    I want to upload cucumber reports
    
Scenario: cucumber report upload
    Given a cucumber report file
    And an evaluation, evaluation tag and subject keys
    When I do a curl POST against the cucumber upload endpoint
    Then I receive a success response
    And the corresponding metrics get created

Scenario: invalid report
    Given an invalid cucumber report file
    And an evaluation, evaluation tag and subject keys
    When I do a curl POST against the cucumber upload endpoint
    Then I receive an error status code
    And the response message contains details on the failed validation

Scenario Outline: missing querystring arguments
    Given a cucumber report file
    And I am missing a(n) <param> parameter
    When I do a curl POST against the cucumber upload endpoint
    Then I receive an error status code
    And the response message contains details on the missing arguments
Examples:
    |      param     |
    | evaluation     |
    | evaluation tag |
    | subject        |
