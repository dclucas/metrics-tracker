function World() {
	const cfg = require('../../app/config');
    this.server = require('../../app/api')(cfg);
	
	var should = require('chai').should();
    
	this.doHttpRequest = function (endpoint, verb, payload) {
		return this.server.then(function (s) {
			const 
				$http = require('http-as-promised')
				headers = {},
				url = s.info.uri + "/" + endpoint;
			
			return $http[verb.toLowerCase()](url, {
				json: payload,
				headers: headers
			});
		})
	};
}

module.exports = function() {
  this.World = World;
};