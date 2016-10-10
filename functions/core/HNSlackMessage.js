function run(params) {
	var payload = JSON.parse(decodeURIComponent(params.payload));
	var callbackId = payload.callback_id;
	var action = payload.actions[0].name;
	if (callbackId == "xxxx") {
		if (action == "yyyy") {
			return { "text": "Thanks! "}
		}
		else {
			return { "text": "Thanks! "}
		}
	}
	else {
		return { "text": "Thanks! "}
	}
}

function getResponse(params, action) {
	var actions = [];
	for (var i=0; i<10; i++) {
		text = value = "" + (i+1);
		if (i == 0) {
			text = text + " (worst)";
		}
		else if (i == 9) {
			text = text + " (best)";
		}
		actions.push({
			"name": value,
			"text": text,
			"type": "button",
			"value": value
		});
	}
	return {
		"text": "What rating would you give this product?",
		"attachments": [
			{
				"fallback": "Sorry, your client does not support this feature.",
				"callback_id": "rate_product",
				"color": "#3AA3E3",
				"attachment_type": "default",
				"actions": actions
			}
		]
	};
}