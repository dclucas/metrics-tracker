const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress } = require('apollo-server-express');

module.exports.createApp = (schema) => {
    const app = express();
    
    // bodyParser is needed just for POST.
    app.use('/graphql', bodyParser.json(), graphqlExpress({
        schema: schema
    }));

    return app;
}