'use strict';

var Types = require('joi');

module.exports = function (server) {
    server.route({
        method: 'GET',
        path: '/healthcheck',
        handler: function (request, reply) {
            reply({ status: 'green' });
        }
    });
};