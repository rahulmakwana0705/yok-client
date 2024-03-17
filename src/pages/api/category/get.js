import connectToDatabase from '../../../lib/mongodb';
import Category from '../../../models/Category';
import Cors from 'micro-cors';

const cors = Cors();

connectToDatabase();

async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Fetch all Category from the database
            const data = await Category.find();
            res.status(200).json({ data });
        } catch (error) {
            console.error('Error fetching Category:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

export default cors(handler);
