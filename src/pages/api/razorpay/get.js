// api/razorpay-keys/get-active.js

import connectToDatabase from '../../../lib/mongodb';
import RazorpayKeys from '../../../models/RazorpayKeys';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const activeKeys = await RazorpayKeys.find({ isActive: true });
            console.log(activeKeys)
            res.status(200).json({ keys: activeKeys });
        } catch (error) {
            console.error('Error fetching active Razorpay keys:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
