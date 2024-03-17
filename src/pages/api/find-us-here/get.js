import FindUsHere from '../../../models/FindUsHere';
import Cors from 'micro-cors';

const cors = Cors();

async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = await FindUsHere.find();
            res.status(200).json({ data });
        } catch (error) {
            console.error('Error fetching FindUsHere:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

export default cors(handler);