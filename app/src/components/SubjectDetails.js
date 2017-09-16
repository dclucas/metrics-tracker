import React from 'react';
import styled from 'styled-components';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as R from 'ramda'
import * as MetricsRenderers from './metricsRenderers'

const SubjectTitle = styled.h1`
`

const MetricsHeader = styled.h2`
`

const MetricsContainer = styled.div``

const SubjectDescription = styled.div`
    color:${({palette}) => palette.secondaryTextColor};
    font-size: small;
`

const MetricsName = styled.h3``

const MetricsSummaryContainer = styled.div``

const parseBoolean = ({value})  => R.cond([
        [R.equals(0), R.always(<span>false</span>) ],
        [R.equals(1), R.always(<span>true</span>) ],
        [R.T, R.always(<span>undefined</span>) ],
])(value);

const parseFloat = (summary)  => R.cond([
    [R.equals(0), R.always(<span>false</span>) ],
    [R.equals(1), R.always(<span>true</span>) ],
    [R.T, R.always(<span>undefined</span>) ],
])(summary.value);


const valueParsers = {
    "BOOLEAN": () => {},
    "INT": () => {},
    "FLOAT": () => {},
}

function renderMetricsSummary(summary) {
    const id = R.pathOr('DEFAULT', ['metrics', 'id'], summary);
    const ValueRenderer = MetricsRenderers[id];
    return <MetricsSummaryContainer key={id}>
        <MetricsName>{summary.metrics.name}</MetricsName>
        <ValueRenderer {...{summary}}/>
    </MetricsSummaryContainer>    
}

function SubjectDetails(props) {
    const { data: { subject }, muiTheme: { palette } } = props;
    return <div>
        <SubjectTitle>{subject.name}</SubjectTitle>
        <SubjectDescription {...{palette}}>{subject.description}</SubjectDescription>
        <MetricsContainer>
            <MetricsHeader>Metrics</MetricsHeader>
            { R.map(renderMetricsSummary, R.pathOr([], ['metricsSummary'], subject) ) }
        </MetricsContainer>
    </div>
}

export default muiThemeable()(SubjectDetails);