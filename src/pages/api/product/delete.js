import corsMiddleware from '../../../lib/cors';
import Product from '../../../models/Products';

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { productId } = req.body;
                console.log('req.body productId', productId);
                if (!productId) {
                    return res.status(400).json({ success: false, message: 'Product ID is required.' });
                }

                const product = await Product.findById(productId);

                if (!product) {
                    return res.status(404).json({ success: false, message: 'Product not found.' });
                }

                await Product.findByIdAndDelete(productId);

                res.status(200).json({ success: true, message: 'Product deleted successfully.' });
            } catch (error) {
                console.error('Error deleting product:', error);
                res.status(500).json({ success: false, message: 'Internal server error.' });
            }
        } else {
            res.status(405).json({ message: 'Method not allowed.' });
        }
    })
}
