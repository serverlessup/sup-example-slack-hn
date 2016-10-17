var config = require("./config.json");

exports.handler = (event, context, callback) => {
    event["serverlessup_host"] = config.serverlessup_host;
	event["serverlessup_token"] = config.serverlessup_token;
	event["slack_client_id"] = config.slack_client_id;
	event["slack_client_secret"] = config.slack_client_secret;
	event["slack_redirect_uri"] = config.slack_redirect_uri;
    run(event,callback);
};

{% include "../core/HNSlackAuth.js" %}