// $DefaultParam:serverlessup_host
// $DefaultParam:serverlessup_token

function main(params) {
    run(params, (error, response) => {
		if (! error) {
			var next = function(err, activation) {
				if (err) {
					console.log("Error calling OpenWhisk action: " + err);
  				  	return whisk.done({ "text": "Sorry, we are experiencing issues right now!" });
  				}
  				else {
					console.log("Call to OpenWhisk action succeeded: " + JSON.stringify(activation,null,2));
  					return whisk.done(response);
				}
			}
			var whiskActionParams = {
  				name: '/markwats@us.ibm.com_hn/HNSlackCommandHN',
  				parameters: params,
				blocking: false,
				next: next
			};
			console.log(JSON.stringify(whiskActionParams,null,2));
			whisk.invoke(whiskActionParams);
		}
		else {
			return whisk.done(error);
		}
	});
	return whisk.async();
};

{% include "../core/HNSlackCommand.js" %}