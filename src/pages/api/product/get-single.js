import connectToDatabase from '../../../lib/mongodb';
import Product from '../../../models/Products';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { slug } = req.body;
        console.log('slig', slug);
        try {
            // Find the product in the database by ID
            const product = await Product.findById(slug);

            if (!product) {
                // If product with the given ID is not found, return 404 Not Found
                return res.status(404).json({ error: 'Product not found' });
            }

            // Return the product
            res.status(200).json(product);
        } catch (error) {
            console.error('Error fetching product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        // Handle unsupported HTTP methods
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
