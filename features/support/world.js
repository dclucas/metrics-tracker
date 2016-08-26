function World() {
	const 
        cfg = require('../../app/config'),
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

    this.uploadTo = function(endpoint, payload) {
        const 
            formData = { cucumber: payload };
        return new Promise(function(resolve, reject) {
            request({
                method: 'POST',
                url: 'http://localhost:2426/upload/cucumber', 
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