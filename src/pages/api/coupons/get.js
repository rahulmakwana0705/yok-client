// pages/api/coupon.js
import connectToDatabase from '../../../lib/mongodb';
import Coupon from '../../../models/Coupons';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'GET') {
            try {
                // Retrieve all coupon data from the database
                const coupons = await Coupon.find({});
                res.status(200).json({ coupons });
            } catch (error) {
                console.error('Error retrieving coupon data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
