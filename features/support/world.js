const 
    cfg = require('../../app/config'),
    fs = require('fs'),
    request = require('request'),
    should = require('chai').should(),
    $http = require('http-as-promised'),
    server = require('../../app/api')(cfg),
    adapter = server.then(s => require('../../app/utils/db-adapter')(s)),
    baseUrl = 'http://localhost:2426/',
    log = require('../../app/utils/logger'),
    Promise = require('bluebird');

function World() {
    this.server = server;
    this.adapter = adapter;

	this.doHttpRequest = function (endpoint, verb, payload) {
        const 
            $http = require('http-as-promised')
            headers = {},
            // fixme: remove hardcoded port, at least
            url = `${baseUrl}${endpoint}`;

        log.trace(`performing a ${verb} against ${url}`);
        return this.server.then(() => 
            $http[verb.toLowerCase()](url, {
                json: payload,
                headers: headers
            })
            .spread(res => {
                log.trace(`got response:`);
                log.trace(res);
                return res;
            })
        );
	};

    this.getByKey = function(resourceName, key) {
        // todo: add traces here for easier troubleshooting
        // todo: consider turning this into the main HTTP helper
        return this.server.then(() =>
            new Promise((resolve, reject) => {
                request({
                    method: 'GET',
                    url: `http://localhost:2426/${resourceName}?filter[key]=${key}`
                }, 
                (err, httpResponse, body) => {
                    if (err) return reject(err);
                    return resolve(httpResponse);
                });
            })
        );
    }

    this.uploadTo = function(endpoint, filePath) {
        const 
            fp = require('path').resolve(__dirname, filePath),
            formData = { cucumber: fs.createReadStream(fp) };
        return this.server.then(() =>
            new Promise(function(resolve, reject) {
                request({
                    method: 'POST',
                    url: `http://localhost:2426/${endpoint}`, 
                    formData: formData
                }, function(err, httpResponse, body){
                    if (err) return reject(err);
                    return resolve(httpResponse);            
                });
            })
        );
    };

    this.upsertResource = function(resource) {
        return adapter.then((a) => {
            a.upsert(resource)
        });
    }
}

module.exports = function() {
  this.World = World;
};