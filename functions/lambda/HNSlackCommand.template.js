var config = require("./config.json");
var aws = require('aws-sdk');

exports.handler = (event, context, callback) => {
    //context.callbackWaitsForEmptyEventLoop = false;
	run(event, (err, response) => {
		if (! err) {
			var lambda = new aws.Lambda();
			var lambdaParams = {
  				FunctionName: 'HNSlackCommandHN',
  				Payload: JSON.stringify(event),
				InvocationType: "Event"
			};
			lambda.invoke(lambdaParams, (error, data) => {
				if (error) {
					console.log("Error calling lambda function: " + error);
  				  	callback(null, { "text": "Sorry, we are experiencing issues right now!" });
  				}
  				else {
					console.log("Call to lambda function succeeded: " + data);
  					callback(null, response);
				}
			});
		}
		else {
			callback(null, response);
		}
	});
};

{% include "../core/HNSlackCommand.js" %}