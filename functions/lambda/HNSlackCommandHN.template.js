var config = require("./config.json");

exports.handler = (event, context, callback) => {
    //context.callbackWaitsForEmptyEventLoop = false;
	event["serverlessup_host"] = config.serverlessup_host;
	event["serverlessup_token"] = config.serverlessup_token;
	run(event,callback);
};

{% include "../core/HNSlackCommandHN.js" %}