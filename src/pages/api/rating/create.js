// pages/api/ratings.js
import connectToDatabase from '../../../lib/mongodb';
import Rating from '../../../models/Rating';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { message, name, email, rating, productId, productName, userId, userName, userEmail } = req.body;

                if (rating < 1 || rating > 5) {
                    return res.status(400).json({ error: 'Invalid rating. Rating must be an integer between 1 and 5.' });
                }

                const newRating = new Rating({ message, name, email, rating, productId, productName, userId, userName, userEmail });
                await newRating.save();

                res.status(201).json({ message: 'Rating saved successfully', rating: newRating });
            } catch (error) {
                console.error('Error saving rating:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
