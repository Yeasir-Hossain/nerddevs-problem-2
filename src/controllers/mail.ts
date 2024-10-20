import { Worker } from "worker_threads";
import { resolve } from "path";
import { MailOptions } from "nodemailer/lib/json-transport";

export default class MailService {
	private static instance: MailService;
	private worker!: Worker;

	private constructor() {
		this.worker = new Worker(resolve(__dirname, "../../dist/controllers/mailWorker.js"));

		// Handle errors or unexpected exits in the worker
		this.worker.on("error", (err) => console.error("Worker error:", err));
		this.worker.on("exit", (code) => {
			if (code !== 0) this.restartWorker();
		});
	}

	static getInstance() {
		if (!MailService.instance) {
			MailService.instance = new MailService();
		}
		return MailService.instance;
	}

	sendMail(options: MailOptions): Promise<any> {
		return new Promise((resolve, reject) => {
			this.worker.postMessage(options);

			// Listen for the worker's response
			this.worker.once("message", (result) => {
				if (result.success) resolve(result.info);
				else reject(result.error);
			});
		});
	}

	private restartWorker() {
		console.log("=> Restarting mail worker");
		this.worker = new Worker(resolve(__dirname, "../../dist/controllers/mailWorker.js"));
	}
}
