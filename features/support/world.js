function World() {
	const cfg = require('../../app/config');
	
	var should = require('chai').should();
    
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
        return new Promise((resolve, reject) => {
            const spawn = require('child_process').spawn;
            //const ls = spawn('curl', ['-X POST', '-F file=@features/fixtures/cucumber.json', 'http://localhost:2426/upload/cucumber?assessmentKey=17215175-ca39-4932-b5c9-d5ebf1a4882b']);
            const ls = spawn('curl', [
                '-X POST',
                '-s',
                '-o /dev/null', 
                '-w "%{http_code}"', 
                '-F file=@features/fixtures/cucumber.json', 
                'http://localhost:2426/upload/cucumber'
                ]);

            ls.stdout.on('data', (data) => {
                resolve(data.toString('utf8'));
            });

            ls.stderr.on('data', (data) => {
                reject(data.toString('utf8'));
            });
        })
    };
}

module.exports = function() {
  this.World = World;
};