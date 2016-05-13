Feature: project management
    As an API client
    I want to manage my projects

Scenario: adding data -- green path
    Given a valid project payload 
    When I do a POST against the /projects/ endpoint
    Then I receive a response with a 200 status code
    And the response contains the newly created resource

  