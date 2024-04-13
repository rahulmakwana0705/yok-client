import corsMiddleware from '../../../lib/cors';
import connectToDatabase from '../../../lib/mongodb';
import Banners from '../../../models/Banners';
import AWS from 'aws-sdk';
import s3 from '../../../lib/aws-config'


connectToDatabase();

export default async function handler(req, res) {
    console.log(req.method)
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { id } = req.body;

                // Check if ID is provided
                if (!id) {
                    return res.status(400).json({ error: 'Banner ID is required' });
                }

                // Find the banner by ID
                const banner = await Banners.findById(id);

                // Check if the banner exists
                if (!banner) {
                    return res.status(404).json({ error: 'Banner not found' });
                }

                // Extract image URLs from the banner
                const { image: { mobile: { url: mobileImageUrl }, desktop: { url: desktopImageUrl } } } = banner;

                // Delete the banner document from the database
                await Banners.findByIdAndDelete(id);

                // Delete images from AWS S3 bucket

                await Promise.all([
                    s3.deleteObject({ Bucket: process.env.NEXT_AWS_BUCKET_NAME, Key: mobileImageUrl.split('com/')[1] }).promise(),
                    s3.deleteObject({ Bucket: process.env.NEXT_AWS_BUCKET_NAME, Key: desktopImageUrl.split('com/')[1] }).promise()
                ]);

                // Send a success response
                res.status(200).json({ message: 'Banner deleted successfully' });
            } catch (error) {
                console.error('Error deleting banner:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }

        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    })
}
