const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const cors = require('cors')

module.exports.createApp = (schema) => {
    const app = express();
    
    app.use(cors());

    app.use('/graphql', bodyParser.json(), graphqlExpress({
        schema: schema
    }));

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
    }));

    return app;
}