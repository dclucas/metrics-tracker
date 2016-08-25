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

    this.uploadTo = function(endpoint, payload) {
        return this.server.then(function (s) {
            const spawn = require('child_process').spawn;
            //const ls = spawn('curl', ['-X POST', '-F file=@features/fixtures/cucumber.json', 'http://localhost:2426/upload/cucumber?assessmentKey=17215175-ca39-4932-b5c9-d5ebf1a4882b']);
            const ls = spawn('curl', ['-X POST', '-F file=@features/fixtures/cucumber.json', 'http://localhost:2426/upload/cucumber']);

            ls.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });

            ls.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
            });

            ls.on('close', (code) => {
                console.log(`child process exited with code ${code}`);
            });
        });
    };
        /*
        const 
            Curl = require( 'node-libcurl' ).Curl,
            curl = new Curl();
        //curl.setOpt( 'URL', `localhost:2426/${endpoint}`);
        curl.setOpt( 'URL', `localhost:2426/upload/cucumber`);
        curl.setOpt( Curl.option.HTTPPOST, [
            { name: 'cucumber', contents: JSON.stringify(payload) }
        ]);
        return new Promise((resolve, reject) => {
            curl.on('data', (chunk) => {
                console.log(chunk);
            });
            curl.on('end', (statusCode, body, headers) => {
                console.log(statusCode);
                resolve({statusCode: statusCode, body: body});
            });
            curl.on('error', (err) => reject(err));
        });
    }
        */

        
        /*
curl.setOpt( 'URL', 'www.google.com' );
curl.setOpt( 'FOLLOWLOCATION', true );
 
curl.on( 'end', function( statusCode, body, headers ) {
 
    console.info( statusCode );
    console.info( '---' );
    console.info( body.length );
    console.info( '---' );
    console.info( this.getInfo( 'TOTAL_TIME' ) );
 
    this.close();
});
 
curl.on( 'error', curl.close.bind( curl ) );
curl.perform();        
         */
        /*
        // fixme: refactor this copy/paste code
        return this.server.then(function (s) {
			const 
				$http = require('http-as-promised')
                // allow: ['multipart/form-data'],
				//headers = {"content-type": "multipart/form-data"},
				headers = {},
				url = s.info.uri + "/" + endpoint;
			
			return $http.post(url, {
				json: payload,
				headers: headers
			})
            .spread(r => {
                console.log(r);
            })
        })
        */
}

module.exports = function() {
  this.World = World;
};