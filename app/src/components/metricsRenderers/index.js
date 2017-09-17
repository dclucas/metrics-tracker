import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

// todo: refactor color to use theme
const ValueContainer = styled.div`
    color: ${({metGoal, goal}) => metGoal? 'green' : goal? 'red' : 'black' };
`;

const comparers = {
    EQUALS: R.equals,
    NOT_EQUALS: R.compose(R.not, R.equals),
    GREATER_THAN: R.gt,
    LESSER_THAN: R.lt,
    GREATER_OR_EQUAL: R.gte,
    LESSER_OR_EQUAL: R.lte
}

// todo: localize this
const comparerTexts = {
    EQUALS: 'does not equal',
    NOT_EQUALS: 'equals',
    GREATER_THAN: 'is not greater than',
    LESSER_THAN: 'is less than',
    GREATER_OR_EQUAL: 'is less than',
    LESSER_OR_EQUAL: 'is greater than',
}

// todo: turn this into a "maybe"
const metGoal = (summary) => summary.goal? 
  comparers[summary.goal.matchBy](summary.value, summary.goal.value)
  : null

const flattenSummary = (s) => 
  R.merge(
    R.pick(['value'], s), 
    R.reject(
      R.isNil, 
      { 
          metGoal: metGoal(s),
          goal: R.path(['goal', 'value'], s),
      })
  )

const maximumSignificantDigits = 3;
const perc = (x) => Number(x).toLocaleString(undefined,{style: 'percent', maximumSignificantDigits})
const frac = (x) => Number(x).toLocaleString(undefined,{maximumSignificantDigits})

const PercentageRenderer = (summary) => (
<ValueContainer {...summary}
>
    {perc(summary.value)}
</ValueContainer>)

export const BRANCH_COVERAGE = ({summary}) => <PercentageRenderer {...flattenSummary(summary)}/>
export const PASSING_TESTS = ({summary}) => <PercentageRenderer {...flattenSummary(summary)}/>
// todo: implement proper default behavior
export const DEFAULT = ({summary}) => <PercentageRenderer {...flattenSummary(summary)}/>
