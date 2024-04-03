import AWS from 'aws-sdk';
import multer from 'multer';
import Category from '../../../models/Category';
import s3 from '../../../lib/aws-config';

// Configure multer to handle file uploads
const upload = multer();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Use multer middleware to handle file uploads
            upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }])(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading files:', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                // Access form data
                const { name, slug, productCount, tags } = req.body;

                // Function to upload file to S3
                const uploadToS3 = async (file, prefix) => {
                    if (!file) return null;
                    const params = {
                        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
                        Key: `${Date.now().toString()}-${file.originalname}`,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                        ACL: 'public-read',
                    };

                    try {
                        const data = await s3.upload(params).promise();
                        return data.Location;
                    } catch (error) {
                        console.error(`Error uploading ${prefix} to S3:`, error);
                        throw error;
                    }
                };

                // Upload image and icon concurrently
                const [imageUrl, iconUrl] = await Promise.all([
                    uploadToS3(req.files['image'] ? req.files['image'][0] : null, 'image'),
                    uploadToS3(req.files['icon'] ? req.files['icon'][0] : null, 'icon'),
                ]);

                // Create a new Category document
                const category = new Category({
                    name,
                    slug,
                    productCount,
                    tags: tags ? JSON.parse(tags) : [],
                    image: { original: imageUrl, thumbnail: imageUrl, id: 1 },
                    icon: iconUrl,
                });

                // Save the category to the database
                await category.save();

                // Send response with image URLs
                res.status(200).json({ success: true, message: 'Category Created Successfully.', category });
            });
        } catch (error) {
            if (error.name === 'MongoTimeoutError') {
                console.error('MongoDB operation timed out:', error);
                res.status(500).json({ message: 'Database operation timed out.' });
            } else {
                console.error('Error processing form data:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}
