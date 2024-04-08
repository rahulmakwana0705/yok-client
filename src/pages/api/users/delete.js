import corsMiddleware from '../../../lib/cors';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';

// Connect to the database
connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { userId } = req.body;

                if (!userId) {
                    return res.status(400).json({ error: 'Missing userId' });
                }

                const deletedUser = await User.findByIdAndDelete(userId);

                if (!deletedUser) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.status(200).json({ message: 'User deleted successfully', deletedUser });
            } catch (error) {
                console.error('Error deleting user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    })
}
