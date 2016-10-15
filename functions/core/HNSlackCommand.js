// $DefaultParam:serverlessup_host
// $DefaultParam:serverlessup_token

function run(params, callback) {
	var command = decodeURIComponent(params.command);
	if (command == "/hn") {
		getTopStories(params, callback);
	}
	else {
		var response = { "text": "Sorry, I do not understand the command '" + command + "'." };
		callback(null, response);
	}
}

function getTopStories(params, callback) {
	var slackCallbackUrl = decodeURIComponent(params.response_url)
	var response = { "text": "Top 20 Hacker News stories coming right up... (" + slackCallbackUrl + ")" };
	callback(null, response);
	getCachedValue(params.serverlessup_host, params.serverlessup_token, 'topstories', (err, statusCode, json) => {
		if (err || ! json || json.length == 0) {
			getAndCacheTopStories(params, callback);
		}
		else {
			slackPost = {
				text: "Here are the top 20 Hacker News stories:",
				attachments: JSON.parse(json)
			};
			console.log("Sending to Slack (from kv) @ " + slackCallbackUrl);
			postToSlack(slackCallbackUrl, slackPost, (err, statusCode) => {
			});
		}
	});
}

function getAndCacheTopStories(params, callback) {
	var slackCallbackUrl = decodeURIComponent(params.response_url)
	getHackerNewsTopStories(20, (err, stories) => {
		if (err) {
			console.log("ERROR GETTING STORIES FROM HN")
			callback(err); // mw:TODO:send to slack
		}
		else {
			slackPost = {
				text: "Here are the top 20 Hacker News stories:",
				attachments: stories
			};
			saveCachedValue(params.serverlessup_host, params.serverlessup_token, 'topstories', stories, (err, statusCode) => {
				if (err) {
					console.log("ERROR SAVING CACHED VALUE: " + err);
					callback(err); // mw:TODO:send to slack
				}
				else {
					console.log("Sending to Slack (after saving to kv) @ " + slackCallbackUrl);
					postToSlack(slackCallbackUrl, slackPost, (err, statusCode) => {
					});
				}
			});
		}				
	});
}

function getNewStories(params) {
	
}

function getAskHN(params) {

}

function getJobs(params) {
	
}


{% include "../lib/HackerNewsAPI.js" %}
{% include "../lib/ServerlessUpAPI.js" %}
{% include "../lib/SlackAPI.js" %}