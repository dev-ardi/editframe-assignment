// require("dotenv").config({});
const { Editframe } = require("@editframe/editframe-js");
const express = require("express");
const { Worker } = require("node:worker_threads");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
	res.send("Hello World!");
});
app.post("/videos/create", (req, res) => {
	const worker = new Worker("./worker.js");
	worker.on("message", (message) => {
		res.send(message);
	});
});
const editframe = new Editframe({
	clientId: "MFsMTu0ygleFmoDqKn0QXe",
	token: "tBrZnyLM4Dd8moDqKn0QXe",
});
app.get("/videos", async (req, res) => {
	res.send(await editframe.videos.all());
});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});
