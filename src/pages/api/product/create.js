import AWS from 'aws-sdk';
import multer from 'multer';

// Configure AWS SDK with your credentials and desired region
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

// Configure multer to handle file uploads
const upload = multer();

export const config = {
    api: {
        bodyParser: false, // Disables automatic parsing of the request body as JSON
    },
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Use multer middleware to handle file uploads
            upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 10 }])(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading files:', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                // Access form data
                const { name, description } = req.body;
                const imageFile = req.files['image'] ? req.files['image'][0] : null; // Access the single image file

                // Upload single image to S3
                const uploadSingleImage = async () => {
                    if (!imageFile) return null;
                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: `${Date.now().toString()}-${imageFile.originalname}`, // Generate a unique file name using timestamp and original name
                        Body: imageFile.buffer,
                        ContentType: imageFile.mimetype,
                        ACL: 'public-read', // Set ACL to public-read if you want the uploaded files to be publicly accessible
                    };

                    try {
                        const data = await s3.upload(params).promise();
                        return data.Location;
                    } catch (error) {
                        console.error('Error uploading single image to S3:', error);
                        throw error;
                    }
                };

                // Upload gallery images to S3
                const uploadGalleryImages = async () => {
                    if (!req.files['gallery']) return [];
                    return Promise.all(
                        req.files['gallery'].map(async (file) => {
                            const params = {
                                Bucket: process.env.AWS_BUCKET_NAME,
                                Key: `${Date.now().toString()}-${file.originalname}`, // Generate a unique file name using timestamp and original name
                                Body: file.buffer,
                                ContentType: file.mimetype,
                                ACL: 'public-read', // Set ACL to public-read if you want the uploaded files to be publicly accessible
                            };

                            try {
                                const data = await s3.upload(params).promise();
                                return data.Location;
                            } catch (error) {
                                console.error('Error uploading gallery image to S3:', error);
                                throw error;
                            }
                        })
                    );
                };

                // Upload single image and gallery images concurrently
                const [imageUrl, galleryImageUrls] = await Promise.all([uploadSingleImage(), uploadGalleryImages()]);

                // Process form data as needed

                // Send response with image URLs
                res.status(200).json({ message: 'Form submitted successfully.', imageUrl, galleryImageUrls });
            });
        } catch (error) {
            console.error('Error processing form data:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}
