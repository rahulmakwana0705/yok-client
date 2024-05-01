import Order from '../../../models/Order';
import connectToDatabase from '../../../lib/mongodb';
import { getRazorpayInstance } from '../../../lib/razorPay-config';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const {
                user,
                products,
                totalPrice,
                shippingAddress,
                paymentMethod,
                status,
                paymentStatus,
                transactionId
            } = req.body;

            // Construct order object
            const order = new Order({
                user,
                products,
                totalPrice,
                shippingAddress,
                status,
                paymentMethod,
                paymentStatus,
                transactionId
            });

            // Save order to database
            const savedOrder = await order.save();

            res.status(201).json(savedOrder);
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
