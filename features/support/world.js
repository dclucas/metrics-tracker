function World() {
	const 
        cfg = require('../../app/config'),
        fs = require('fs'),
        request = require('request'),
        should = require('chai').should();
    
	this.doHttpRequest = function (endpoint, verb, payload) {
        const 
            $http = require('http-as-promised')
            headers = {},
            // fixme: remove hardcoded port, at least
            url = `http://localhost:2426/${endpoint}`;
        
        return $http[verb.toLowerCase()](url, {
            json: payload,
            headers: headers
        });
	};

    this.uploadTo = function(endpoint, filePath) {
        const 
            fp = require('path').resolve(__dirname, filePath),
            formData = { cucumber: fs.createReadStream(fp) };
        return new Promise(function(resolve, reject) {
            request({
                method: 'POST',
                url: `http://localhost:2426/${endpoint}`, 
                formData: formData
            }, function(err, httpResponse, body){
                if (err) return reject(err);
                return resolve(httpResponse);            
            });
        });
    };
}

module.exports = function() {
  this.World = World;
};