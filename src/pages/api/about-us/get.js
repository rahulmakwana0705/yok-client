// pages/api/privacy-policy.js
import connectToDatabase from "../../../lib/mongodb";
import AboutUs from "../../../models/AboutUs";
import corsMiddleware from "../../../lib/cors";

connectToDatabase();

export default async function handler(req, res) {
	await corsMiddleware(req, res, async () => {
		if (req.method === "GET") {
			try {
				// Retrieve the latest privacy policy content
				const latestAboutUs = await AboutUs.findOne().sort({
					createdAt: -1,
				});

				res.status(200).json({
					aboutUs: latestAboutUs ? latestAboutUs : null,
				});
			} catch (error) {
				console.error("Error retrieving about us:", error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		} else {
			res.status(405).json({ error: "Method Not Allowed" });
		}
	});
}
