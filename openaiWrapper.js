const OpenAI = require("openai");
const openaikey = process.env.OPENAI_KEY;
const openaiConfig = new OpenAI.Configuration({
	apiKey: openaikey,
});
const openaiAPI = new OpenAI.OpenAIApi(openaiConfig);

const completionTemplate = {
	model: "text-davinci-003",
	temperature: 0,
	max_tokens: 256,
	top_p: 1,
	frequency_penalty: 0,
	presence_penalty: 0,
	stop: ['"""', "/*"], //needed to stop multiple responses sometimes
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
				prompt: `/*write ${prompt.text} in ${prompt.langLabel}*/`,
			})
			.then((response) => {
				return resolve(getTextFromResponse(response).trim()); //sometimes empty lines etc in the beginning so trim()
			})
			.catch((error) => {
				return reject(getMsgFromError(error));
			});
	});
}

function explainCode(prompt) {
	return new Promise((resolve, reject) => {
		openaiAPI
			.createCompletion({
				...completionTemplate,
				prompt: `${prompt.text}

"""
Explain this ${prompt.langLabel} code, concisely:
1.`,
			})
			.then((response) => {
				return resolve(`1. ${getTextFromResponse(response)}`); //add 1. as it was included in the prompt addon
			})
			.catch((error) => {
				return reject(getMsgFromError(error));
			});
	});
}
module.exports = { writeCode, explainCode };
