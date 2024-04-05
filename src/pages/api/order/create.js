import Order from '../../../models/Order';
import connectToDatabase from '../../../lib/mongodb';
import { getRazorpayInstance } from '../../../lib/razorPay-config';


connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { paymentMethod, paymentStatus, products, shippingAddress, status, totalPrice, tracking_number, transactionId, user } = req.body;

            const newOrder = new Order({
                user,
                products,
                totalPrice,
                tracking_number,
                shippingAddress,
                status,
                paymentMethod,
                paymentStatus,
                transactionId
            });

            await newOrder.save();

            const razorPay = await getRazorpayInstance();
            const options = {
                amount: 50000,
                // amount: Number(req.body.amount * 100),
                currency: "INR",
            };
            const order = await razorPay.orders.create(options);

            res.status(200).json({
                success: true,
                order,
                newOrder
            });

        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
