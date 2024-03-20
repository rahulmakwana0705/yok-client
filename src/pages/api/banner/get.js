import connectToDatabase from '../../../lib/mongodb';
import Banners from '../../../models/Banners';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch all Category from the database
            const data = await Banners.find();
            res.status(200).json({ Banners: data });
        } catch (error) {
            console.error('Error fetching Banners:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
