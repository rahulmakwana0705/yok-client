import connectToDatabase from '../../../lib/mongodb';
import { getRazorpayInstance } from '../../../lib/razorPay-config';
import crypto from "crypto";

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Get the Razorpay instance
            const razorpayInstance = await getRazorpayInstance();

            console.log(req.body);
            const { response: { razorpay_signature, razorpay_payment_id, razorpay_order_id } } = req.body;
            console.log(razorpay_signature, razorpay_payment_id, razorpay_order_id);

            const body = razorpay_order_id + "|" + razorpay_payment_id;

            // Get the secret key from Razorpay instance
            const razorpaySecret = razorpayInstance.key_secret;

            const expectedSignature = crypto
                .createHmac("sha256", razorpaySecret)
                .update(body.toString())
                .digest("hex");

            const isAuthentic = expectedSignature === razorpay_signature;

            if (isAuthentic) {
                // Database operations here

                res.status(200).json({
                    success: true,
                    isAuthentic,
                });

            } else {
                res.status(403).json({ error: 'Invalid signature' });
            }
        } catch (error) {
            console.error('Error verifying signature:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
