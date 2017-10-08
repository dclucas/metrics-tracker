const 
    cfg = require('../../app/config'),
    fs = require('fs'),
    request = require('request'),
    should = require('chai').should(),
    server = require('../../app/api')(cfg),
    baseUrl = 'http://localhost:2426/',
    log = require('../../app/utils/logger'),
    Promise = require('bluebird');

function World() {
    this.server = server;

    this.uploadTo = function(endpoint, filePath, dataKey) {
        const 
            fp = require('path').resolve(__dirname, filePath);
        //todo: refactor the 2 lines below
        var formData = {};
        formData[dataKey] = fs.createReadStream(fp);
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
}

module.exports = function() {
  this.World = World;
};