var bodyParser = require('body-parser');
var express = require('express');
var functionRunner = require('./__functionRunner__.js');

var app = express();

app.use(bodyParser.json())

app.post('/function/:func', function(req, res) {
    functionRunner.run(req.params.func, req.body, (error, response) => {
		if (error) {
			res.status(500).send();
		}
		else {
			res.status(200).send(response);
		}
	});
});

app.get('/auth/slack', function(req, res) {
	var args = {
		code: req.query.code,
		state: req.query.state,
		error: req.query.error
	};
	functionRunner.run('HNSlackAuth', args, (error, response) => {
		if (error) {
			res.status(500).send();
		}
		else {
			res.status(200).send(response);
		}
	});
});

// start server
app.listen(3000, '0.0.0.0', function() {
  console.log('Server started on port 3000.')
});