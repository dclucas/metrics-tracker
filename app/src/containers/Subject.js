import React from 'react';
import Header from '../components/Header';

const Subject = (props) => {
    const { match: { params: { subjectId } } } = props;
    return (
    <div>
        <Header {...props}/>
    </div>);
}

export default Subject