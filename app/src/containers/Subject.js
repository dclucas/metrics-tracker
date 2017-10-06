import React from 'react';
import {pure, compose} from 'recompose';
import {gql, graphql} from 'react-apollo'
import { CircularProgress } from 'material-ui/Progress';
import * as R from 'ramda';
import Header from '../components/Header';
import SubjectDetails from '../components/SubjectDetails';

const Subject = (props) => {
    const { data } = props;
    return (
    <div>
        <Header {...props}/>
        { R.cond([
            [ R.propEq('loading', true), R.always(<CircularProgress />) ],
            [ R.prop('subject'), R.always(<SubjectDetails {...R.pick(['data'], props)} />) ],
        ])(data) }
    </div>);
}

const fields = `
name
description
goals {
    value
    matchBy
    metrics {
        id
    }
}
metricsSummary {
    metrics {
        id
        name
        valueType
        optimizeFor
        normalized
        category
        unit
    }
    assessment {
        id
        type
        createdOn
    }
    value
}
`
const data = graphql(gql `
query SubjectDetails($id: ID!) {
    subject(id:$id) {${fields}}
}`, {
    options: props => ({
        variables: {
            id: props.match.params.subjectId
        }
    })
});

export default compose(pure, data)(Subject);