import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/Products';
import jwt from 'jsonwebtoken';


connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        // const SECRET_KEY = process.env.NEXT_SECRET_KEY;
        // const token = req.cookies.auth_token;
        // const decodedToken = jwt.verify(token, SECRET_KEY);
        // console.log('token in get prodct decodedToken', decodedToken)
        try {
            // Check if there's a query parameter 'customizable' and its value is 'true'
            const isCustomizable = req.query.customizable === 'true';

            // Fetch products based on the customizable parameter
            const query = isCustomizable ? { customizable: true } : {};

            // Fetch products from the database based on the query
            const products = await Product.find(query);

            res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
