import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

connectToDatabase();

export default async function handler(req, res) {
    const SECRET_KEY = process.env.NEXT_SECRET_KEY;

    if (req.method === 'POST') {
        try {
            const { email, currentPassword, newPassword } = req.body;

            if (!email || !currentPassword || !newPassword) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const passwordMatch = await bcrypt.compare(currentPassword, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Incorrect current password' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
