// pages/api/privacy-policy.js
import connectToDatabase from '../../../lib/mongodb';
import PrivacyPolicy from '../../../models/PrivacyPolicy';
import corsMiddleware from '../../../lib/cors';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { _id, content, bannerImage, bannerHeading } = req.body;

                // Validate content field
                if (!content || typeof content !== 'string') {
                    return res.status(400).json({ error: 'Invalid content. Content must be a non-empty string.' });
                }

                // Find and update the privacy policy by ID
                const updatedPrivacyPolicy = await PrivacyPolicy.findByIdAndUpdate(
                    _id,
                    { content, bannerImage, bannerHeading },
                    { new: true } // Return the updated document
                );

                if (!updatedPrivacyPolicy) {
                    return res.status(404).json({ error: 'Privacy policy not found.' });
                }

                res.status(200).json({ message: 'Privacy policy updated successfully', privacyPolicy: updatedPrivacyPolicy });
            } catch (error) {
                console.error('Error updating privacy policy:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
