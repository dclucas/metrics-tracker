Feature: Cucumber reports
    As an API client
    I want to upload cucumber reports
    
Scenario: posting notes
    Given a cucumber report file
    And a new assessment key
    When I send it to the cucumber upload endpoint
    Then I receive a success response
    And all relevant data gets created
    