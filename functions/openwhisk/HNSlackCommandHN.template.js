function main(params) {
	console.log("Processing /hn: " + JSON.stringify(params, null, 2));
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

{% include "../core/HNSlackCommandHN.js" %}