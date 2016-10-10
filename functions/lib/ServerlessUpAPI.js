function getCachedValue(host, token, name, callback) {
	var cacheUrl = 'http://' + host + '/api/kv/' + encodeURIComponent(name) + '?=' + encodeURIComponent(token);
	var req = require('http').get(cacheUrl, (res) => {
		var json = null;
		res.on('data', function (chunk) {
			if (json == null) {
				json = '';
			}
			json += chunk;
		});
		res.on('end', function () {
			callback(null, res.statusCode, json);
		})
	});
	req.on('error', (e) => {
		callback(e);
	});
}

function saveCachedValue(host, token, name, value, callback) {
	var postData = JSON.stringify(value);
	var expire = 5 * 60; // 5 minutes
	var options = {
		hostname: host,
		port: 80,
		path: '/api/kv/' + encodeURIComponent(name) + '?t=' + encodeURIComponent(token) + '&e=' + expire,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		}
	};
	var req = require('http').request(options, (res) => {
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