import connectToDatabase from '../../../lib/mongodb';
import Coupon from '../../../models/Coupons';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const {
                    name,
                    type,
                    discount,
                    minimumQuantity,
                } = req.body;

                const newCoupon = new Coupon({
                    name,
                    type,
                    discount,
                    minimumQuantity,
                });
                await newCoupon.save();

                res.status(201).json({ message: 'Coupon data saved successfully', Coupon: newCoupon });
            } catch (error) {
                console.error('Error saving Coupon data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
