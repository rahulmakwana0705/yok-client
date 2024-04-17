// pages/api/coupon.js
import connectToDatabase from '../../../lib/mongodb';
import Coupon from '../../../models/Coupons';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'PUT') {
            try {
                const { _id, name, type, discount, minimumQuantity } = req.body;

                if (!_id) {
                    return res.status(400).json({ error: 'ID is required' });
                }

                const updatedCoupon = await Coupon.findByIdAndUpdate(_id, {
                    name,
                    type,
                    discount,
                    minimumQuantity,
                }, { new: true });

                if (!updatedCoupon) {
                    return res.status(404).json({ error: 'Coupon not found' });
                }

                res.status(200).json({ message: 'Coupon data updated successfully', updatedCoupon });
            } catch (error) {
                console.error('Error updating coupon data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
