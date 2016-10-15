// $DefaultParam:serverlessup_host
// $DefaultParam:serverlessup_token
// $DefaultParam:slack_client_id
// $DefaultParam:slack_client_secret
// $DefaultParam:slack_redirect_uri

function run(params, callback) {
	var error = params.error;
	var code = params.code;
	var state = params.state;
	console.log(JSON.stringify(params, null, 2));
	if (error) {
		console.log("SlackAuth.error = '" + error + "'");
		callback(error);
	}
	else {
		var slackAuthUrl = 'https://slack.com/api/oauth.access';
		slackAuthUrl = slackAuthUrl + '?client_id=' + encodeURIComponent(params.slack_client_id);
		slackAuthUrl = slackAuthUrl + '&client_secret=' + encodeURIComponent(params.slack_client_secret);
		slackAuthUrl = slackAuthUrl + '&redirect_uri=' + encodeURIComponent(params.slack_redirect_uri);
		slackAuthUrl = slackAuthUrl + '&code=' + encodeURIComponent(code);
		console.log("Connecting to Slack @ " + slackAuthUrl);
		var req = require('https').get(slackAuthUrl, (res) => {
			console.log("Slack Response received");
			var body = '';
			res.on('data', function (chunk) {
				body += chunk;
			});
			res.on('end', function () {
				console.log("Slack Response = " + body);
				saveJsonDoc(params.serverlessup_host, params.serverlessup_token, JSON.parse(body), (err, statusCode) => {
					if (err) {
						console.log("ERR = " + err);
						callback(err);
					}
					else {
						console.log("HOLA");
						callback(null, {code:code, state:state, body:body});
					}
				});
			});
		}).on('error', (e) => {
			console.log("Slack Error = " + e);
			callback(e);
		});
	}
}

{% include "../lib/ServerlessUpAPI.js" %}