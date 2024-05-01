import Order from '../../../models/Order';
import connectToDatabase from '../../../lib/mongodb';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            let orders;
            if (req.query.orderid) {
                const order = await Order.findOne({ _id: req.query.orderid });
                if (!order) {
                    return res.status(404).json({ error: 'Order not found' });
                }
                return res.status(200).json({
                    success: true,
                    order,
                });
            } else if (req.query.userid) {
                orders = await Order.find({ user: req.query.userid });
            } else {
                orders = await Order.find({});
            }
            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
