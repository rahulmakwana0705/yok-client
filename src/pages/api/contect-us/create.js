import mongoose from "mongoose";
import ContactUs from "../../../models/ContactUs";
import connectToDatabase from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
import corsMiddleware from "../../../lib/cors";

connectToDatabase();

export default async function handler(req, res) {
	await corsMiddleware(req, res, async () => {
		if (req.method === "POST") {
			try {
				const SECRET_KEY = process.env.NEXT_SECRET_KEY;
				const token = req.cookies.auth_token;

				const decodedToken = jwt.verify(token, SECRET_KEY);
				const userId = decodedToken.userId;

				const { name, email, subject, message } = req.body;

				if (!userId || !name || !email) {
					return res
						.status(400)
						.json({ error: "Missing required fields" });
				}

				const newContactUs = new ContactUs({
					userId,
					name,
					email,
					subject,
					message,
				});

				await newContactUs.save();

				res.status(201).json({
					message: "Contact Us entry created successfully",
					contactUs: newContactUs,
				});
			} catch (error) {
				console.error("Error creating Contact Us entry:", error);
				res.status(500).json({ error: "Internal Server Error" });
			}
		} else {
			res.status(405).json({ error: "Method Not Allowed" });
		}
	});
}
