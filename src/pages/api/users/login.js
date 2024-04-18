import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Cors from 'micro-cors';
import corsMiddleware from '../../../lib/cors';

const cors = Cors();

connectToDatabase();

export default async function handler(req, res) {
    console.log("called")
    await corsMiddleware(req, res, async () => {
        const SECRET_KEY = process.env.NEXT_SECRET_KEY;

        if (req.method === 'POST') {
            try {
                const { email, password, remember_me } = req.body;

                // Check for required fields
                if (!email || !password) {
                    return res.status(400).json({ error: 'Missing required fields' });
                }

                // Find the user by email
                const existingUser = await User.findOne({ email });

                // Check if the user exists
                if (!existingUser) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                // Compare the password
                const passwordMatch = await bcrypt.compare(password, existingUser.password);

                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                // Generate a JWT token
                const token = jwt.sign(
                    { userId: existingUser._id, email: existingUser.email },
                    SECRET_KEY,
                    { expiresIn: '5d' }
                );

                res.status(200).json({ message: 'Login successful', user: existingUser, token });
            } catch (error) {
                console.error('Error during login:', error);
                res.status(500).json({ error: error.message });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    })
}
