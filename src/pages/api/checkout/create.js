import Checkout from '../../../models/Checkout';
import middleware from '../../../../middleware';
import connectToDatabase from '../../../lib/mongodb';

connectToDatabase();

export default async function handler(req, res) {
    await middleware(req, res, async () => {
        await connectToDatabase();
        if (req.method === 'POST') {
            try {
                const {
                    userId,
                    products,
                    firstName,
                    lastName,
                    phone,
                    email,
                    address,
                    city,
                    zipCode,
                    save,
                    note,
                } = req.body;

                if (!userId || !products || !firstName || !lastName || !phone || !email || !address || !city || !zipCode) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                const newCheckout = new Checkout({
                    userId,
                    products,
                    firstName,
                    lastName,
                    phone,
                    email,
                    address,
                    city,
                    zipCode,
                    save,
                    note,
                });

                await newCheckout.save();

                res.status(201).json({ message: 'Checkout created successfully', checkout: newCheckout });
            } catch (error) {
                console.error('Error creating checkout:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
