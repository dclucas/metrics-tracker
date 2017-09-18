import React from 'react';
import styled from 'styled-components';
import { withTheme } from 'material-ui/styles';
import MetrictEntryList from './metricsRenderers';

const SubjectTitle = styled.h1``

const MetricsHeader = styled.h2``

const MetricsContainer = styled.div``

const SubjectDescription = styled.div`
    color:${({palette}) => palette.secondaryTextColor};
    font-size: small;
`
function SubjectDetails(props) {
    const { data: { subject }, theme: { palette } } = props;
    return <div>
        <SubjectTitle>{subject.name}</SubjectTitle>
        <SubjectDescription {...{palette}}>{subject.description}</SubjectDescription>
        <MetricsContainer>
            <MetricsHeader>Metrics</MetricsHeader>
            <MetrictEntryList {...{subject}} />
        </MetricsContainer>
    </div>
}

export default withTheme(SubjectDetails);