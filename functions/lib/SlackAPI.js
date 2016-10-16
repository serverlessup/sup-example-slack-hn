function postToSlack(url, value, callback) {
	var postData = JSON.stringify(value);
	var urlObject = require('url').parse(url);
	var options = {
		hostname: urlObject.host,
		path: urlObject.path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		}
	};
	var req = require('https').request(options, (res) => {
		res.on('data', function(chunk) {
  		});
		res.on('end', () => {
			callback(null, res.statusCode);
		});
	});
	req.on('error', (e) => {
		callback(e);
	});
	// write data to request body
	req.write(postData);
	req.end();
}