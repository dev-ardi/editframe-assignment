const { parentPort } = require("node:worker_threads");
const path = require("path");
const http = require("https");
const fs = require("fs");
const { exec } = require("node:child_process");

const { Editframe } = require("@editframe/editframe-js");
const editframe = new Editframe({
	clientId: "MFsMTu0ygleFmoDqKn0QXe", // TODO secure them in env
	token: "tBrZnyLM4Dd8moDqKn0QXe",
});
const create_vid = async () => {
	try {
		const composition = await editframe.videos.new({
			backgroundColor: "#000",
			dimensions: {
				height: 1920,
				width: 1080,
			},
			duration: 7,
		});
		await composition.addImage(path.resolve("download.jpeg"), {
			size: { format: "fill" },
		});
		// composition.addText({
		// 	text: "Hello World",
		// 	backgroundColor: "#0968af",
		// });
		await composition.addAudio(path.resolve("download.mp3"));
		const video = await composition.encodeSync();

		const file = fs.createWriteStream("video.mp4");
		http.get(video.downloadUrl, function (response) {
			response.pipe(file);
			file.on("finish", () => {
				file.close();
				exec("ffmpeg -i video.mp4 output.mp3", () => {
					parentPort.postMessage("done");
				});
			});
		});
	} catch (error) {
		parentPort.postMessage(error);
	}
};

create_vid();
