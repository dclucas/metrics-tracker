import React from 'react';
import styled from 'styled-components';
import * as R from 'ramda';
import { PieChart, Pie, Cell } from 'recharts';
import OkIcon from 'material-ui-icons/CheckCircle';
import ErrorIcon from 'material-ui-icons/Error';
import Card from 'material-ui/Card';

const comparers = {
    EQUALS: R.equals,
    NOT_EQUALS: R.compose(R.not, R.equals),
    GREATER_THAN: R.gt,
    LESSER_THAN: R.lt,
    GREATER_OR_EQUAL: R.gte,
    LESSER_OR_EQUAL: R.lte
}

const colors = {
    'okGoal': 'green',
    'notOkGoal': 'red',
    'noGoal': 'grey',
}

const pickColor = (flattenedSummary) => R.cond([
    [ R.propEq('metGoal', true), R.always(colors.okGoal)],
    [ R.propEq('metGoal', false), R.always(colors.notOkGoal)],
    [ R.T, R.always(colors.noGoal) ],
])(flattenedSummary);
// todo: turn this into a "maybe"
const metGoal = (summary) => summary.goal? 
  comparers[summary.goal.matchBy](summary.value, summary.goal.value)
  : null

export const flattenSummary = (s) => {
    return R.merge(
        R.pick(['value'], s), 
        R.reject(
            R.isNil, 
            { 
                metGoal: metGoal(s),
                goal: R.path(['goal', 'value'], s),
                unit: R.path(['metrics', 'unit'], s),
            })
    )
}

const secondaryFill = '#e2e2e2'
const neutralFill = '#666666'
const renderCustomizedLabel = (input) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, fill } = input;
    if (fill === secondaryFill) return <text />;
    const RADIAN = Math.PI / 180;
    // fixme: fix the x/y calc
    const radius = innerRadius + (outerRadius - innerRadius) * .2;
    const x  = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const renderGoalLabel = (input) => {
    if (input.fill === neutralFill) {
        return <text x={155} y={25} fill={neutralFill}>goal</text>
    }
    return null;
}

const getPercData = (val) => R.pair(
    {value: val}, 
    {value: 1-val},
);

const PercentageRenderer = ({value, metGoal, goal}) => {
    const data = getPercData(value);
    const goalData = getPercData(goal);
    const primaryFill = metGoal? 'green': goal? 'red' : 'grey';
    const colors = [primaryFill, secondaryFill];
    const goalColors = [neutralFill, 'white'];
    return <PieChart width={200} height={150}>
        <Pie
            label={renderCustomizedLabel} 
            labelLine={false}
            dataKey='value'
            data={data} 
            cx={87} 
            cy={70} 
            outerRadius={50} 
            fill="#8884d8"
        >
        {
            data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]}/>
              ))
        }
        </Pie>
        {
            goal? <Pie
            label={renderGoalLabel} 
            labelLine={false}
            dataKey='value'
            data={goalData} 
            cx={87} 
            cy={70} 
            innerRadius={55}
            outerRadius={70} 
            fill="#8884d8"
        >
        {
            data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={goalColors[index]}/>
              ))
        }
        </Pie>
        : null
        }
    </PieChart>
}

// fixme: this code makes the (weak) assumption that 'true' is good. It should compare with the goal.
const icons = {
    0.0: <ErrorIcon style={{color:colors.notOkGoal, width: '7em', height: '7em'}}/>,
    1.0: <OkIcon style={{color:colors.okGoal, width: '7em', height: '7em'}}/>,
}
const BooleanValueContainer = styled.div`
    text-align: center;
    padding: 1em;
`
const renderers = {
    "PERCENTAGE": ({summary}) => PercentageRenderer(flattenSummary(summary)),
    "BOOLEAN": ({summary}) => BooleanRenderer(flattenSummary(summary)),
    "INT": ({summary}) => IntRenderer(flattenSummary(summary)),
    "UNKNOWN": (props) => { console.log(props); return <div>Dunno</div>; },
}
const BooleanRenderer = ({value}) => <BooleanValueContainer>{icons[value]}</BooleanValueContainer>

const IntValueContainer = styled.div`
text-align: center;
padding: 1em;
font-size: xx-large;
`

const IntRenderer = (summary) => <IntValueContainer
    style={{color: pickColor(summary)}}
>
    {`${summary.value} ${summary.unit}`}
</IntValueContainer>

// FIXME: refactor so that the whole metrics entry is wrapped in this module
export const DEFAULT = (props) => R.propOr(
    renderers.UNKNOWN, 
    R.pathOr('', ['summary','metrics','valueType'], props),
    renderers)(props);

const MetricsListContainer = styled.div`
    display: flex;
    margin: 1em;
    padding: .25em;
    width: 100%;
    max-width: 100%;
    flex-wrap: wrap;
`


const MetricsEntryContainer = styled(Card)`
    min-width: 12em;
    max-width: 12em;
    height: 14em;
    margin: .25em;
    padding: 0px;
    border: 1px solid #9e9e9e;
`

const MetricsEntryTitle = styled.h3`
    margin: .5em;
    text-align: center;
`

const MetricsEntryHeader = styled.div`
    /*background-color: ${({metGoal, goal}) => metGoal? 'green' : goal? 'red' : 'grey'};
    color: white;*/
    margin: 0px;
    padding: 0px;
    width:100%;
    height: 4em;
` 


const MetricsEntryContent = styled.div`
    padding: 0px;
    margin: 0px;
    height: 100%;
    width: 100%;
`

const MetricsEntry = (summary) => {
    const id = R.path(['metrics', 'id'], summary);
    //const ValueRenderer = R.propOr(MetricsRenderers.DEFAULT, id, MetricsRenderers);
    const ValueRenderer = DEFAULT;
    // todo: this whole thing should be moved to another module, as the renderer
    // may use multiple columns, etc.
    const flattened = flattenSummary(summary);
    return <MetricsEntryContainer key={id}>
        <MetricsEntryHeader {...flattened}>
            <MetricsEntryTitle>{summary.metrics.name}</MetricsEntryTitle>
        </MetricsEntryHeader>
        <MetricsEntryContent>
            <ValueRenderer {...{summary}} style={{padding:'0px',backgroundColor:'blue'}}/>
        </MetricsEntryContent>
    </MetricsEntryContainer>    
}

const MetricsEntryList = ({subject}) => 
    <MetricsListContainer cellHeight={200} cols={4}>  
        { R.map(MetricsEntry, R.pathOr([], ['metricsSummary'], subject) ) }
    </MetricsListContainer>

export default MetricsEntryList;