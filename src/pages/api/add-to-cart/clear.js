import Cart from "../../../models/Cart";
import connectToDatabase from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Product from "../../../models/Products";

connectToDatabase();

export default async function handler(req, res) {
	if (req.method === "DELETE") {
		try {
			const { id } = req.body; // Assuming the ID of the item to delete is sent in the request body

			// Delete the cart item by ID
			const deletedItem = await Cart.findByIdAndDelete(id);

			if (!deletedItem) {
				return res.status(404).json({ error: "Cart item not found" });
			}

			res.status(200).json({ message: "Cart item deleted successfully" });
		} catch (error) {
			console.error("Error deleting cart item:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
