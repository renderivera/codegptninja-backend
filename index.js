require("dotenv").config();
const express = require("express");
const cors = require("cors");
const openai = require("./openaiWrapper");

const port = process.env.PORT;
const corsOrigin = process.env.CORSORIGIN;

const app = express();

app.use(
	cors({
		origin: corsOrigin,
	}),
	express.json()
);

const verifyReq = (req, res) => {
	if (!req.body?.prompt) {
		res.status(400).json({
			error: "prompt in body is missing",
		});
		return false;
	}
	return true;
};

app.post("/api/code", (req, res) => {
	if (!verifyReq(req, res)) return;

	const prompt = req.body.prompt;

	openai
		.writeCode(prompt)
		.then((code) => {
			res.json({ code });
		})
		.catch((error) => {
			res.status(500).json({ error });
		});
});

app.listen(port, () => {
	console.log(`Server running on port ${port}...`);
});
