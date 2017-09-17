import React from 'react';
import styled from 'styled-components';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as R from 'ramda'
import * as MetricsRenderers from './metricsRenderers'
import {GridList, GridTile} from 'material-ui/GridList';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const SubjectTitle = styled.h1`
`

const MetricsHeader = styled.h2`
`

const MetricsContainer = styled.div``

const SubjectDescription = styled.div`
    color:${({palette}) => palette.secondaryTextColor};
    font-size: small;
`

const MetricsListContainer = styled.div`
    display: flex;
    padding: .25em;
`

const MetricsEntryContainer = styled(Card)`
    width: 10em;
    height: 10em;
    margin: .25em;
`

const MetricsEntryHeader = styled(CardHeader)`
`

const MetricsEntryText = styled(CardText)`
    padding: 0px;
    margin: 0px;
`

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
    const id = R.path(['metrics', 'id'], summary);
    const ValueRenderer = R.propOr(MetricsRenderers.DEFAULT, id, MetricsRenderers);
    return <MetricsEntryContainer key={id}>
        <MetricsEntryHeader
            title={summary.metrics.name}
        />
        <MetricsEntryText>
            <ValueRenderer {...{summary}} style={{padding:'0px',backgroundColor:'blue'}}/>
        </MetricsEntryText>
    </MetricsEntryContainer>    
}

function SubjectDetails(props) {
    const { data: { subject }, muiTheme: { palette } } = props;
    return <div>
        <SubjectTitle>{subject.name}</SubjectTitle>
        <SubjectDescription {...{palette}}>{subject.description}</SubjectDescription>
        <MetricsContainer>
            <MetricsHeader>Metrics</MetricsHeader>
            <MetricsListContainer>  
                { R.map(renderMetricsSummary, R.pathOr([], ['metricsSummary'], subject) ) }
            </MetricsListContainer>
        </MetricsContainer>
    </div>
}

export default muiThemeable()(SubjectDetails);