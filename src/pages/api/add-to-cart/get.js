import Cart from '../../../models/Cart';
import connectToDatabase from '../../../lib/mongodb';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import Product from '../../../models/Products';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // const SECRET_KEY = process.env.SECRET_KEY;
            // const token = req.cookies.auth_token;

            // const decodedToken = jwt.verify(token, SECRET_KEY);
            // const userId = decodedToken.userId;

            const { userId } = req.body
            console.log('userId', userId);
            // Fetch cart items for the specific user
            const cartItems = await Cart.find({ userId })

            const promises = [];

            // Loop through each cart item and push promises to the array
            cartItems.forEach(cartItem => {
                // Push promise to fetch user details
                promises.push(User.findById(cartItem.userId).select('-password'));
                // Push promise to fetch product details
                promises.push(Product.findById(cartItem.productId));
            });

            // Wait for all promises to resolve
            const [users, products] = await Promise.all(promises);

            // Loop through cart items to add user and product details
            // cartItems.forEach(cartItem => {
            //     // Find user corresponding to cart item
            //     const user = users.find(user => user._id.toString() === cartItem.userId.toString());
            //     // Find product corresponding to cart item
            //     const product = products.find(product => product._id.toString() === cartItem.productId.toString());
            //     // Add user and product details to cart item object
            //     cartItem.user = user;
            //     cartItem.product = product;
            // });

            res.status(200).json({ cartItems, users, products });
        } catch (error) {
            console.error('Error fetching cart items:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
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