Feature: mapping
    As a developer
    I want to use internal mapping functions to simplify report processing
    
Scenario Outline: simple payload mapping
    Given a(n) <entity> entity
    When I map it with the mapResource method
    Then I receive a correctly mapped entity
Examples:
    | entity     |
    | subject    |
    | assessment |
    
Scenario: cucumber report mapping
    Given a cucumber report object
    When I map it with the mapCucumber method
    Then I receive a correctly mapped set of entities