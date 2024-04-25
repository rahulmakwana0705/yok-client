import connectToDatabase from '../../../lib/mongodb';
import Order from '../../../models/Order';

import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { _id } = req.body;

                if (!_id) {
                    return res.status(400).json({ error: 'ID is required' });
                }

                const deletedCoupon = await Order.findByIdAndDelete(_id);

                if (!deletedCoupon) {
                    return res.status(404).json({ error: 'Order not found' });
                }

                res.status(200).json({ message: 'Order deleted successfully' });
            } catch (error) {
                console.error('Error deleting Order:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
