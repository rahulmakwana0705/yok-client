import Cart from "../../../models/Cart";
import connectToDatabase from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Product from "../../../models/Products";

connectToDatabase();

export default async function handler(req, res) {
	if (req.method === "PATCH") {
		try {
			const { id } = req.body; // Assuming the ID of the item to increase quantity is sent in the request body

			// Find the cart item by ID
			const cartItem = await Cart.findById(id);

			if (!cartItem) {
				return res.status(404).json({ error: "Cart item not found" });
			}

			// Increase the quantity by 1
			cartItem.quantity += 1;

			// Save the updated cart item
			await cartItem.save();

			res.status(200).json({
				message: "Cart item quantity increased successfully",
			});
		} catch (error) {
			console.error("Error increasing cart item quantity:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
