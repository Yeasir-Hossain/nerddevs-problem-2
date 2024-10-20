import { parentPort } from "worker_threads";
import nodemailer, { Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

let transporter: Transporter;

// Initialize the transporter when the worker starts
const initializeTransporter = () => {
	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST!,
		port: parseInt(process.env.SMTP_PORT!),
		secure: process.env.SMTP_TLS === "yes",
		auth: {
			user: process.env.SMTP_USER!,
			pass: process.env.SMTP_PASSWORD!,
		},
	});

	transporter.verify()
		.then(() => console.log("=> Mail transporter initialized"))
		.catch((err) => console.error("Transporter initialization failed:", err));
};

initializeTransporter();

// Listen for messages from the main thread
parentPort?.on("message", async (mailOptions: MailOptions) => {
	try {
		const info = await transporter.sendMail(mailOptions);
		parentPort?.postMessage({ success: true, info }); // Send success response
	} catch (error) {
		parentPort?.postMessage({ success: false, error }); // Send error response
	}
});
