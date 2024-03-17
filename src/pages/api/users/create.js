import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Connect to the database
connectToDatabase();

export default async function handler(req, res) {
    const SECRET_KEY = process.env.SECRET_KEY;

    if (req.method === 'POST') {
        try {
            const { name, email, password } = req.body;

            // Check for required fields
            if (!name || !email || !password) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user instance
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
            });

            await newUser.save();

            const token = jwt.sign(
                { userId: newUser._id, email: newUser.email },
                SECRET_KEY,
                { expiresIn: '5d' }
            );

            res.status(201).json({ message: 'User created successfully', user: newUser, token });
        } catch (error) {
            if (error.name === 'MongoServerError' && error.code === 11000) {
                // Duplicate key error (email already exists)
                res.status(400).json({ error: 'Email address already in use' });
            } else {
                console.error('Error creating user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
