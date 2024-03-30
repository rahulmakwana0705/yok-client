import Order from '../../../models/Order';
import { razorPay } from '../../../lib/razorPay-config';
import connectToDatabase from '../../../lib/mongodb';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const options = {
                amount: 50000,
                // amount: Number(req.body.amount * 100),
                currency: "INR",
            };
            const order = await razorPay.orders.create(options);

            res.status(200).json({
                success: true,
                order,
            });


        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
