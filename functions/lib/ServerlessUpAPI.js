function getJsonDoc(host, token, id, callback) {
	var options = {
		hostname: host,
		port: 443,
		path: '/api/json/' + encodeURIComponent(name) + '?t=' + encodeURIComponent(token),
		rejectUnauthorized: false
	};
	var req = require('https').get(options, (res) => {
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

function saveJsonDoc(host, token, value, callback) {
	var postData = JSON.stringify(value);
	var expire = 5 * 60; // 5 minutes
	var options = {
		hostname: host,
		port: 80,
		path: '/api/jd?t=' + encodeURIComponent(token),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		},
		rejectUnauthorized: false
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

function getCachedValue(host, token, name, callback) {
	var options = {
		hostname: host,
		port: 443,
		path: '/api/kv/' + encodeURIComponent(name) + '?t=' + encodeURIComponent(token),
		rejectUnauthorized: false
	};
	var req = require('https').get(options, (res) => {
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
		console.log("ERROR1: " + e);
		callback(e);
	});
	req.end();
}

function saveCachedValue(host, token, name, value, callback) {
	var postData = JSON.stringify(value);
	var expire = 5 * 60; // 5 minutes
	var options = {
		hostname: host,
		port: 443,
		path: '/api/kv/' + encodeURIComponent(name) + '?t=' + encodeURIComponent(token) + '&e=' + expire,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		},
		rejectUnauthorized: false
	};
	var req = require('https').request(options, (res) => {
		res.on('data', function(chunk) {
  		});
		res.on('end', () => {
			callback(null, res.statusCode);
		});
	});
	req.on('error', (e) => {
		console.log("ERROR2: " + e);
		callback(e);
	});
	req.write(postData);
	req.end();
}