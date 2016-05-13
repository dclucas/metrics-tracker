function World() {
    this.server = require('../../app/app.js');
    
	this.doHttpRequest = function (endpoint, verb, payload) {
	    const 
            $http = require('http-as-promised'), 
	        config = require('../../app/config.js')
            headers = {};
        
        const url = this.server.info.url + "/" + endpoint;
        
	    return $http[verb.toLowerCase()](url, {
	        json: payload,
            headers: headers
	    });
	};
}

module.exports = function() {
  this.World = World;
};