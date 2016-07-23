Feature: Cucumber reports
    As an API client
    I want to upload cucumber reports
    
Scenario: posting notes
    Given a cucumber json report payload
    When I POST it against the /exams/cucumber endpoint
    Then I receive a 202 status code
    