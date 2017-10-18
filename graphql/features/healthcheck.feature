Feature: health check
    As an API client
    I want to know when the app is running fine
    
Scenario: checking the /healthcheck endpoint
    Given the system is up and running
    When I do a GET against the /healthcheck endpoint
    Then I receive a 200 status code
    And a payload containing a 'green' status