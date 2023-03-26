require("dotenv").config();
const express = require("express");
const cors = require("cors");
const openai = require("./openaiWrapper");

const port = process.env.PORT;
const corsOrigin = process.env.CORSORIGIN;
const app = express();
app.use(cors({ origin: corsOrigin }), express.json());

const verifyReq = (req, res) => {
	if (!req.body?.prompt || req.body?.prompt.length == 0) {
		res.status(400).json({ error: "prompt in body is missing" });
		return false;
	}
	return true;
};

app.post("/writecode", (req, res) => {
	if (!verifyReq(req, res)) return;
	const prompt = req.body.prompt;

	openai
		.writeCode(prompt)
		.then((ai) => res.json({ ai }))
		.catch((error) =>
			res.status(error.status).send({ error: error.statusText })
		);
});

app.post("/explaincode", (req, res) => {
	if (!verifyReq(req, res)) return;
	const prompt = req.body.prompt;

	openai
		.explainCode(prompt)
		.then((ai) => res.json({ ai }))
		.catch((error) =>
			res.status(error.status).send({ error: error.statusText })
		);
});

app.use((req, res, next) => {
	res.status(404).send("Sorry can't find that!");
});

app.listen(port, () => console.log(`Server running on port ${port}...`));
