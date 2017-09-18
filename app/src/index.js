import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Routes from './Routes'
import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { BrowserRouter } from 'react-router-dom'
import Auth from './Auth'

const auth = new Auth();
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

const networkInterface = createNetworkInterface({
    uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:3001/graphql',
  });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    const token = auth.getToken();
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  }
}]);
  
const client = new ApolloClient({
  networkInterface,
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ApolloProvider>
  ,
  document.getElementById('root'),
);
registerServiceWorker();
