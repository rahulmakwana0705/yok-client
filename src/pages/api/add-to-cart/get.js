import Cart from "../../../models/Cart";
import connectToDatabase from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
import User from "../../../models/User";
import Product from "../../../models/Products";

connectToDatabase();

export default async function handler(req, res) {
	if (req.method === "GET") {
		try {
			const SECRET_KEY = process.env.NEXT_SECRET_KEY;
			const token = req.cookies.auth_token;

			const decodedToken = jwt.verify(token, SECRET_KEY);
			const userId = decodedToken.userId;

			// const { userId } = req.body
			console.log("userId", userId);
			const cartItems = await Cart.find({ userId });

			res.status(200).json({ cartItems });
		} catch (error) {
			console.error("Error fetching cart items:", error);
			res.status(500).json({ error: "Internal Server Error" });
		}
	} else {
		res.status(405).json({ error: "Method Not Allowed" });
	}
}
// {
//     "id": "6.M.Orange",
//     "name": "Armani Wide-Leg Trousers",
//     "slug": "armani-wide-leg-trousers",
//     "image": "/assets/images/products/p-16.png",
//     "price": 60,
//     "attributes": {
//         "size": "M",
//         "color": "Orange"
//     },
//     "quantity": 1,
//     "itemTotal": 60
// }
