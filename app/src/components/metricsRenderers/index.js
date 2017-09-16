import React from 'react';
import styled from 'styled-components';

const ValueContainer = styled.div``;


const PercentageRenderer = ({summary}) => <ValueContainer>
    {Math.round(summary.value * 1000) / 10}
</ValueContainer>

//export const BRANCH_COVERAGE = <PercentageRenderer />
//export const BRANCH_COVERAGE = (measurement) => <ValueContainer>foo</ValueContainer>;
export const BRANCH_COVERAGE = ({summary}) => <PercentageRenderer {...{summary}}/>
export const DEFAULT = <PercentageRenderer />