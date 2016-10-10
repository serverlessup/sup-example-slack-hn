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

function getTopStories(params, slackResponsUrl) {
	getCachedValue(params.serverlessup_host, params.serverlessup_token, 'topstories', (err, statusCode, json) => {
		if (err || ! json || json.length == 0) {
			getAndCacheTopStories(params, slackResponsUrl);
		}
		else {
			slackPost = {
				text: "Here are the top 20 Hacker News stories:",
				attachments: JSON.parse(json)
			};
			console.log("FROM SUP = " + JSON.stringify(slackPost, null, 2));
		}
	});
	return { "text": "Top 20 Hacker News stories coming right up..." };
}

function getAndCacheTopStories(params, slackResponsUrl) {
	getHackerNewsTopStories(20, (err, stories) => {
		if (err) {
			console.log("ERROR GETTING STORIES FROM HN")
		}
		else {
			slackPost = {
				text: "Here are the top 20 Hacker News stories:",
				attachments: stories
			};
			console.log("FROM HN = " + JSON.stringify(slackPost, null, 2));
			saveCachedValue(params.serverlessup_host, params.serverlessup_token, 'topstories', stories, (err, statusCode) => {
				if (err) {
					console.log("ERROR SAVING CACHED VALUE: " + err);
				}
				else {
					console.log("SAVE CACHED VALUE STATUS CODE = " + statusCode);
				}
			})
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