import multer from 'multer';
import connectToDatabase from '../../../lib/mongodb';
import Banners from '../../../models/Banners';
import s3 from '../../../lib/aws-config'


connectToDatabase();

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
            upload.fields([{ name: 'desktopImage', maxCount: 1 }, { name: 'mobileImage', maxCount: 1 }])(req, res, async (err) => {
                if (err) {
                    console.error('Error uploading files:', err);
                    return res.status(500).json({ message: 'Internal server error.' });
                }

                // Access form data
                const { title, slug } = req.body;
                const desktopImage = req.files['desktopImage'] ? req.files['desktopImage'][0] : null;
                const mobileImage = req.files['mobileImage'] ? req.files['mobileImage'][0] : null;

                // Upload images to S3
                const uploadImageToS3 = async (imageFile) => {
                    if (!imageFile) return null;
                    const params = {
                        Bucket: process.env.NEXT_AWS_BUCKET_NAME,
                        Key: `${Date.now().toString()}-${imageFile.originalname}`,
                        Body: imageFile.buffer,
                        ContentType: imageFile.mimetype,
                        ACL: 'public-read',
                    };

                    try {
                        const data = await s3.upload(params).promise();
                        return data.Location;
                    } catch (error) {
                        console.error('Error uploading image to S3:', error);
                        throw error;
                    }
                };

                // Upload desktop and mobile images
                const [desktopImageUrl, mobileImageUrl] = await Promise.all([
                    uploadImageToS3(desktopImage),
                    uploadImageToS3(mobileImage),
                ]);

                // Create a new Banner document
                const banner = new Banners({
                    title,
                    slug,
                    image: {
                        desktop: { url: desktopImageUrl },
                        mobile: { url: mobileImageUrl },
                    },
                });

                // Save the banner to the database
                await banner.save();

                // Send success response
                res.status(200).json({ success: true, message: 'Banner created successfully.', banner });
            });
        } catch (error) {
            console.error('Error processing form data:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}