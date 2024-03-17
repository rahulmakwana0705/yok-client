// pages/api/privacy-policy.js
import connectToDatabase from '../../../lib/mongodb';
import TermsCondition from '../../../models/TermsCondition';
import corsMiddleware from '../../../lib/cors';


connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { content, bannerImage, bannerHeading } = req.body;

                // Validate content field
                if (!content || typeof content !== 'string') {
                    return res.status(400).json({ error: 'Invalid content. Content must be a non-empty string.' });
                }

                // Save the new privacy policy content
                const newTermsCondition = new TermsCondition({ content, bannerImage, bannerHeading });
                await newTermsCondition.save();

                res.status(201).json({ message: 'Term and Condition saved successfully', TermsCondition: newTermsCondition });
            } catch (error) {
                console.error('Error saving Term and Condition:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
