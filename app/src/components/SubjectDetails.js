import React from 'react';
import styled from 'styled-components';
import { withTheme } from 'material-ui/styles';
import * as R from 'ramda'
import MetricsEntry from './metricsRenderers';
import { GridList } from 'material-ui/GridList';

const SubjectTitle = styled.h1``

const MetricsHeader = styled.h2``

const MetricsContainer = styled.div``

const SubjectDescription = styled.div`
    color:${({palette}) => palette.secondaryTextColor};
    font-size: small;
`

const MetricsListContainer = styled(GridList)`
    display: flex;
    padding: .25em;
`

function SubjectDetails(props) {
    const { data: { subject }, theme: { palette } } = props;
    return <div>
        <SubjectTitle>{subject.name}</SubjectTitle>
        <SubjectDescription {...{palette}}>{subject.description}</SubjectDescription>
        <MetricsContainer>
            <MetricsHeader>Metrics</MetricsHeader>
            {/*
            <GridList cellHeight={300} cols={3}>  
                { R.map(s => <MetricsEntry summary={s} key={s.metrics.id}/>, R.pathOr([], ['metricsSummary'], subject) ) }
            </GridList>
            */}
            <MetricsEntry {...{subject}} />
        </MetricsContainer>
    </div>
}

export default withTheme(SubjectDetails);