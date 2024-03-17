import connectToDatabase from '../../../lib/mongodb';
import Brands from '../../../models/Brands';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch all Category from the database
            const data = await Brands.find();
            res.status(200).json({ brands: data });
        } catch (error) {
            console.error('Error fetching Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
