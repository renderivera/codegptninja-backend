const OpenAI = require("openai");
const openaikey = process.env.OPENAI_KEY;
const openaiConfig = new OpenAI.Configuration({
	apiKey: openaikey,
});
const openaiAPI = new OpenAI.OpenAIApi(openaiConfig);

const completionTemplate = {
	model: "code-cushman-001",
	temperature: 0,
	max_tokens: 512,
	top_p: 0.5,
	frequency_penalty: 1,
	presence_penalty: 1,
	stop: ['"""', "/*"], // needed to stop openai codex to return multiple responses sometimes
};

const explainPromptAddon = `

"""
What is this code doing?
1. `; //some prompt engineering to get a half decent response from openai in form of a list

const testPromptAddon = `

"""
Write unit test for this code.
"""`;

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
				prompt: `${prompt} ${explainPromptAddon}`,
			})
			.then((response) => {
				return resolve(`1. ${getTextFromResponse(response)}`); //add 1. as it was included in the prompt addon
			})
			.catch((error) => {
				return reject(getMsgFromError(error));
			});
	});
}

function writeUnitTest(prompt) {
	return new Promise((resolve, reject) => {
		openaiAPI
			.createCompletion({
				...completionTemplate,
				prompt: `${prompt} ${testPromptAddon}`,
			})
			.then((response) => {
				return resolve(getTextFromResponse(response).trim()); //sometimes empty lines etc in the beginning so trim()
			})
			.catch((error) => {
				return reject(getMsgFromError(error));
			});
	});
}

module.exports = { writeCode, explainCode, writeUnitTest };
