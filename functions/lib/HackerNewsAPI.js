function getHackerNewsTopStories(count, callback) {
	var topStoriesUrl = 'https://hacker-news.firebaseio.com/v0/topstories.json';
	var req = require('https').get(topStoriesUrl, (res) => {
		var stories = [];
		var storyIdsJson = '';
		res.on('data', function (chunk) {
			storyIdsJson += chunk;
		});
		res.on('end', function () {
			var storyIds = JSON.parse(storyIdsJson);
			if (storyIds && storyIds.length > 0) {
				var i = 0;
				getStoryCallback = function(err, story) {
					if (story) {
						stories.push({
							author_name: story.title,
							author_link: story.url,
							title: story.score + ' point(s) by ' + story.by + ' X comments',
							title_link: 'https://news.ycombinator.com/item?id=' + story.id
						});
					}
					i = i + 1;
					if (i >= Math.min(count,storyIds.length)) {
						callback(null, stories);
					}
					else {
						getHackerNewsStory(storyIds[i], getStoryCallback);
					}
				};
				getHackerNewsStory(storyIds[i], getStoryCallback);
			}
		});
	}).on('error', (e) => {
		callback(e, null);
	});
}

function getHackerNewsStory(storyId, callback) {
	var storyUrl = 'https://hacker-news.firebaseio.com/v0/item/' + storyId + '.json';
	var req = require('https').get(storyUrl, (res) => {
		var storyJson = '';
		res.on('data', function (chunk) {
			storyJson += chunk;
		});
		res.on('end', function () {
			var story = JSON.parse(storyJson);
			callback(null, story);
		});
	}).on('error', (e) => {
		callback(e, null);
	});
}