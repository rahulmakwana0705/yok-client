// pages/api/contact-form.js
import connectToDatabase from '../../../lib/mongodb';
import ContactForm from '../../../models/b2b';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'GET') {
            try {
                const contactForms = await ContactForm.find({});

                res.status(200).json(contactForms);
            } catch (error) {
                console.error('Error fetching contact form data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
