require("dotenv").config();
const express = require("express");
const cors = require("cors");
const openai = require("./openaiWrapper");

const port = process.env.PORT;

const app = express();

app.use(
	cors({
		origin: "http://localhost:3000",
	}),
	express.json()
);

app.post("/api/code", (req, res) => {
	if (!req.body?.prompt) {
		res.status = 400;
		res.send({
			error: "prompt in body is missing",
		});
		return;
	}

	const prompt = req.body.prompt;

	openai
		.writeCode(prompt)
		.then((ores) => {
			res.send({
				code: ores,
			});
		})
		.catch((error) => {
			res.status = 500;
			res.send({
				error: error,
			});
		});
});

app.listen(port);
