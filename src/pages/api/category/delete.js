import corsMiddleware from '../../../lib/cors';
import connectToDatabase from '../../../lib/mongodb';
import Category from '../../../models/Category';
import s3 from '../../../lib/aws-config';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { id } = req.body;

                // Check if ID is provided
                if (!id) {
                    return res.status(400).json({ error: 'Category ID is required' });
                }

                // Find the category by ID
                const category = await Category.findById(id);

                console.log(category)

                // Check if the category exists
                if (!category) {
                    return res.status(404).json({ error: 'Category not found' });
                }

                // Extract image URLs from the category
                const { image: { original }, icon } = category;

                // Delete the category document from the database
                await Category.findByIdAndDelete(id);

                // Delete images and icon from AWS S3 bucket
                const deletePromises = [];
                if (original) {
                    deletePromises.push(s3.deleteObject({ Bucket: process.env.NEXT_AWS_BUCKET_NAME, Key: original.split('com/')[1] }).promise());
                }
                if (icon) {
                    deletePromises.push(s3.deleteObject({ Bucket: process.env.NEXT_AWS_BUCKET_NAME, Key: icon.split('com/')[1] }).promise());
                }
                await Promise.all(deletePromises);

                // Send a success response
                res.status(200).json({ message: 'Category deleted successfully' });
            } catch (error) {
                console.error('Error deleting category:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}
