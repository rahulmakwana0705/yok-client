// pages/api/ratings.js
import connectToDatabase from '../../../lib/mongodb';
import Rating from '../../../models/Rating';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const ratings = await Rating.find({});

                res.status(200).json({ ratings });
            } catch (error) {
                console.error('Error retrieving ratings:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
