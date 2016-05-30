Feature: API endpoints
    As an API client
    I want to perform basic CRUD operations
    
Scenario Outline: posting notes
    Given a <resource> payload
    When I POST it against the <endpoint> endpoint
    Then I receive a 201 status code
    And a payload containing the newly created resource
    
Examples:
    | resource             | endpoint        |
    | valid assessment     | /assessments    |
