import Order from '../../../models/Order';
import { razorPay } from '../../../lib/razorPay-config';
import connectToDatabase from '../../../lib/mongodb';
import crypto from "crypto";

// connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            console.log(req.body)
            const { response: { razorpay_signature, razorpay_payment_id, razorpay_order_id } } = req.body
            console.log(razorpay_signature, razorpay_payment_id, razorpay_order_id)
            const body = razorpay_order_id + "|" + razorpay_payment_id;

            const expectedSignature = crypto
                .createHmac("sha256", process.env.NEXT_RAZORPAY_SECERET)
                .update(body.toString())
                .digest("hex");

            const isAuthentic = expectedSignature === razorpay_signature;

            if (isAuthentic) {
                // Database comes here


                res.status(200).json({
                    success: true,
                    isAuthentic,
                });

            }
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

