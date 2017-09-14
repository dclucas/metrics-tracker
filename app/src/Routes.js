import React from 'react'
import {Route, BrowserRouter} from 'react-router-dom'
import App from './App'
import Callback from './containers/Callback'
import User from './containers/User'
import Subject from './containers/Subject'
import Auth from './Auth'
import history from './history'

const auth = new Auth()

const handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
        auth.handleAuthentication()
    }
}

export default() => {
    return (
        <BrowserRouter history={history} component={App}>
            <div>
                <Route path="/" exact render={(props) => <App auth={auth} {...props}/>}/>
                <Route path="/u/:username" render={props => <User auth={auth} {...props}/>}/>
                <Route path="/s/:subjectId" render={(props) => <App auth={auth} {...props}/>}/>
                <Route
                    path="/callback"
                    render={(props) => {
                    handleAuthentication(props);
                    return <Callback {...props}/>
                }}/>
            </div>
        </BrowserRouter>
    );
}