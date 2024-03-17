import connect from '../../lib/mongodb.js';
import User from '../../models/User.js';

export default async function handler(req, res) {
    const { method } = req;

    const db = await connect();

    switch (method) {
        case 'GET':
            try {
                const users = await User.find({});
                res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;
        case 'POST':
            try {
                const { name, email } = req.body;
                const newUser = new User({ name, email });
                await newUser.save();
                res.status(201).json(newUser);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            break;
        default:
            res.status(404).json({ message: 'Method not allowed' });
    }
}
