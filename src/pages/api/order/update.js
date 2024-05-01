import Order from '../../../models/Order';
import connectToDatabase from '../../../lib/mongodb';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ error: 'orderId and status are required' });
            }

            const order = await Order.findOne({ _id: id });
            if (!order) {
                return res.status(404).json({ error: 'Order not found' });
            }

            order.paymentStatus = "paid";
            await order.save();

            res.status(200).json({ success: true, order });

        } catch (error) {
            console.error('Error updating order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
