function main(params) {
	run(params, (error, response) => {
		if (error) {
			return whisk.done(error);
		}
		else {
			return whisk.done(response);
		}
	});
	return whisk.async();
}

{% include "../core/HNSlackMessage.js" %}