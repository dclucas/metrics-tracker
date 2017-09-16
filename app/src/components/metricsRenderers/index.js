import React from 'react';
import styled from 'styled-components';

const ValueContainer = styled.div``;

/*
const comparers = {
    EQUALS: R.equals,
    NOT_EQUALS: null,
    GREATER_THAN: R.gt,
    LESSER_THAN: R.lt,
    GREATER_OR_EQUAL: R.gte,
    LESSER_OR_EQUAL: R.lte
}

const summary = {
  assessment: {},
  metrics: {
    id: 'BRANCH_COVERAGE',
    name: 'Branch Coverage',
    normalized: true,
    optimizeFor: "MAX",
    valueType: "FLOAT",
  },
  goal: {
    value: .8,
    matchBy: 'GREATER_THAN',
  },
  value: .8479,
}

// todo: turn this into a "maybe"
const metGoal = (summary) => summary.goal? 
  comparers[summary.goal.matchBy](summary.value, summary.goal.value)
  : null

const flattenSummary = (s) => 
  R.merge(
    R.pick(['value'], s), 
    R.reject(
      R.isNil, { metGoal: metGoal(s)})
  )

//flattenSummary(summary)
metGoal(summary)
*/

const flattenSummary = (summary) => summary;

const PercentageRenderer = ({summary}) => (
<ValueContainer>
    {Math.round(summary.value * 1000) / 10}%
</ValueContainer>)

export const BRANCH_COVERAGE = ({summary}) => <PercentageRenderer {...{summary}}/>
export const DEFAULT = <PercentageRenderer />