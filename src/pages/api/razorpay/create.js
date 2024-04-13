// api/razorpay-keys/create.js

import connectToDatabase from '../../../lib/mongodb';
import RazorpayKeys from '../../../models/RazorpayKeys';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { key, secret, isActive } = req.body;

            // Validate required fields
            if (!key || !secret) {
                return res.status(400).json({ error: 'Key and secret are required fields.' });
            }

            // Check if the key already exists
            const existingKey = await RazorpayKeys.findOne({ key });
            if (existingKey) {
                return res.status(400).json({ error: 'Key already exists.' });
            }
            const existingSeceret = await RazorpayKeys.findOne({ secret });
            if (existingSeceret) {
                return res.status(400).json({ error: 'secret already exists.' });
            }

            // Create new Razorpay key
            const newKey = new RazorpayKeys({ key, secret, isActive });
            await newKey.save();

            res.status(201).json({ message: 'Razorpay key created successfully', key: newKey });
        } catch (error) {
            console.error('Error creating Razorpay key:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
