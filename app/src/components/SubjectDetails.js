import React from 'react';
import styled from 'styled-components';
import { withTheme } from 'material-ui/styles';
import * as R from 'ramda'
import * as MetricsRenderers from './metricsRenderers'
import Paper from 'material-ui/Paper';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import { PieChart, Pie, Sector, Cell } from 'recharts';

const SubjectTitle = styled.h1`
`

const MetricsHeader = styled.h2`
`

const MetricsContainer = styled.div``

const SubjectDescription = styled.div`
    color:${({palette}) => palette.secondaryTextColor};
    font-size: small;
`

const MetricsListContainer = styled(GridList)`
    display: flex;
    padding: .25em;
`

const MetricsEntryContainer = styled(GridListTile)`
    width: 10em;
    height: 10em;
    margin: .25em;
    border: 1px solid #9e9e9e;
`

const MetricsEntryHeader = styled(GridListTileBar)`
`

const MetricsEntryText = styled.div`
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

const data01 = [{name: 'covered', value: .7}, {name: 'not covered', value: .3}]

function renderMetricsSummary(summary) {
    const id = R.path(['metrics', 'id'], summary);
    const ValueRenderer = R.propOr(MetricsRenderers.DEFAULT, id, MetricsRenderers);
    // todo: this whole thing should be moved to another module, as the renderer
    // may use multiple columns, etc.
    const flattened = MetricsRenderers.flattenSummary(summary);
    return <MetricsEntryContainer key={id}>
        <MetricsEntryHeader
            title={summary.metrics.name}
            style={{backgroundColor: flattened.metGoal? 'green' : flattened.goal? 'red' : 'grey'}}
        />
        <MetricsEntryText>
            <ValueRenderer {...{summary}} style={{padding:'0px',backgroundColor:'blue'}}/>
        </MetricsEntryText>
    </MetricsEntryContainer>    
}

function SubjectDetails(props) {
    const { data: { subject }, theme: { palette } } = props;
    return <div>
        <SubjectTitle>{subject.name}</SubjectTitle>
        <SubjectDescription {...{palette}}>{subject.description}</SubjectDescription>
        <MetricsContainer>
            <MetricsHeader>Metrics</MetricsHeader>
            <MetricsListContainer cellHeight={200} cols={3}>  
                { R.map(renderMetricsSummary, R.pathOr([], ['metricsSummary'], subject) ) }
            </MetricsListContainer>
        </MetricsContainer>
    </div>
}

export default withTheme(SubjectDetails);