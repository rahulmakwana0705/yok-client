import ContactUs from "../../../models/ContactUs";
import connectToDatabase from "../../../lib/mongodb";
import corsMiddleware from "../../../lib/cors";

connectToDatabase();

export default async function handler(req, res) {
	await corsMiddleware(req, res, async () => {
		if (req.method === "GET") {
			try {
				// Retrieve all contact form submissions
				const contactForms = await ContactUs.find();

				res.status(200).json({ contactForms });
			} catch (error) {
				console.error("Error fetching contact forms:", error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		} else {
			res.status(405).json({ error: "Method Not Allowed" });
		}
	});
}
