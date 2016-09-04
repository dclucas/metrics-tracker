Feature: Cucumber reports
    As an API client
    I want to upload cucumber reports
    
Scenario: report upload
    Given a cucumber report file
    And new assessment, exam and subject keys
    When I send it to the cucumber upload endpoint
    Then I receive a success response
    And all relevant data gets created

Scenario: report upload -- idempotent upload
    Given a cucumber report file
    And an existing set of assessment, exam and subject keys
    When I send it to the cucumber upload endpoint
    Then I receive a success response
    And all relevant data gets created
    And the existing data is not touched

Scenario: invalid report
    Given an invalid cucumber report file
    And new assessment, exam and subject keys
    When I send it to the cucumber upload endpoint
    Then I receive an error status code
    And the response message contains details on the failed validation

Scenario: missing querystring arguments
    Given a cucumber report file
    And I am missing either an assessment and/or exam and/or subject keys
    When I send it to the cucumber upload endpoint
    Then I receive an error status code
    And the response message contains details on the missing arguments
