import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';

// todo: refactor color to use theme
const ValueContainer = styled.div`
    color: ${({metGoal, goal}) => metGoal? 'green' : goal? 'red' : 'black' };
`;

const comparers = {
    EQUALS: R.equals,
    NOT_EQUALS: null,
    GREATER_THAN: R.gt,
    LESSER_THAN: R.lt,
    GREATER_OR_EQUAL: R.gte,
    LESSER_OR_EQUAL: R.lte
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

const PercentageRenderer = ({summary}) => (
<ValueContainer {...summary}
>
    {/*Math.round(summary.value * 1000) / 10*/}
    {perc(summary.value)}
</ValueContainer>)

export const BRANCH_COVERAGE = ({summary}) => <PercentageRenderer {...{summary: flattenSummary(summary)}}/>
export const DEFAULT = <PercentageRenderer />