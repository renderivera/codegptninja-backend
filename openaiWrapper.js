const OpenAI = require("openai");
const openaikey = process.env.OPENAI_KEY;
const openaiConfig = new OpenAI.Configuration({
	apiKey: openaikey,
});
const openaiAPI = new OpenAI.OpenAIApi(openaiConfig);

const completionTemplate = {
	model: "code-cushman-001",
	temperature: 0,
	max_tokens: 256,
	top_p: 1,
	frequency_penalty: 0,
	presence_penalty: 0,
	stop: ["/*"], // needed to stop openai codex to return multiple responses sometimes
};

function getTextFromResponse(response) {
	return response.data.choices[0].text;
}

function getMsgFromError(error) {
	return error.response ? error.response : error.message;
}

function writeCode(prompt) {
	return new Promise((resolve, reject) => {
		openaiAPI
			.createCompletion({
				...completionTemplate,
				prompt: `/*write a ${prompt}*/`,
			})
			.then((response) => {
				return resolve(getTextFromResponse(response));
			})
			.catch((error) => {
				return reject(getMsgFromError(error));
			});
	});
}

module.exports = { writeCode };
