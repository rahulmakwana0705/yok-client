import faq from '../../../models/FAQ';
import corsMiddleware from '../../../lib/cors';
import Cors from 'micro-cors';

async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { question, answer } = req.body;

                const newFAQ = new faq({ question, answer });

                const savedFAQ = await newFAQ.save();

                res.status(201).json({ data: savedFAQ });
            } catch (error) {
                console.error('Error saving data to faq:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}

export default handler;
