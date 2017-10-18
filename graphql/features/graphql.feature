Feature: graphql
    As an API client
    I want to consume metrics data
    
Scenario: subject snapshot
    Given an existing subject with associated data
    When I run a subject snapshot query
    Then I receive a valid response
