Feature: Cucumber reports
    As an API client
    I want to upload cucumber reports
    
Scenario: cucumber report upload
    Given a cucumber report file
    And an evaluation, evaluation tag and subject keys
    When I do a curl POST against the cucumber upload endpoint
    Then I receive a success response
    And the corresponding metrics get created

Scenario: report upload
    Given a cucumber report file
    And new assessment, exam and subject keys
    When I send it to the cucumber upload endpoint
    Then I receive a success response
    And the following data gets created:
    |  resource kind |
    | subjects       |
    | assessments    |
    | exams          |
    | checks         |

Scenario: report upload -- idempotent upload
    Given a cucumber report file
    And an existing set of assessment, exam and subject keys
    When I send it to the cucumber upload endpoint
    Then I receive a success response
    And the following data gets created:
    |  resource kind |
    | checks         |
    And the following data is not touched:
    |  resource kind |
    | subjects       |
    | assessments    |
    | exams          |

Scenario: invalid report
    Given an invalid cucumber report file
    And new assessment, exam and subject keys
    When I send it to the cucumber upload endpoint
    Then I receive an error status code
    And the response message contains details on the failed validation

Scenario Outline: missing querystring arguments
    Given a cucumber report file
    And I am missing a(n) <resource> key
    When I send it to the cucumber upload endpoint
    Then I receive an error status code
    And the response message contains details on the missing arguments
Examples:
    |  resource  |
    | assessment |
    | exam       |
    | subject    |
