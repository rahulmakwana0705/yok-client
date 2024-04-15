// pages/api/contact-form.js
import connectToDatabase from '../../../lib/mongodb';
import ContactForm from '../../../models/b2b';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const {
                    name,
                    email,
                    phone,
                    city,
                    numberOfShops,
                    quantity,
                    message,
                    selectedCheckboxes,
                } = req.body;

                // Save the new contact form data
                const newContactForm = new ContactForm({
                    name,
                    email,
                    phone,
                    city,
                    numberOfShops,
                    quantity,
                    message,
                    selectedCheckboxes,
                });
                await newContactForm.save();

                res.status(201).json({ message: 'Contact form data saved successfully', ContactForm: newContactForm });
            } catch (error) {
                console.error('Error saving contact form data:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
