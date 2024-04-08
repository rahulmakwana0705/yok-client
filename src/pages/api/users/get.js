import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const users = await User.find();

            res.status(200).json({ users });
        } catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
