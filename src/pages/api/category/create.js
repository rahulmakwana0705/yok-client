import connectToDatabase from '../../../lib/mongodb';
import Category from '../../../models/Category';


connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const categoriesData = req.body;

            if (!Array.isArray(categoriesData) || categoriesData.length === 0) {
                return res.status(400).json({ error: 'Invalid request format. Expected a non-empty array of categories.' });
            }

            const newCategories = await Promise.all(
                categoriesData.map(async (category) => {
                    const { id, name, slug, productCount, icon, tags, image } = category;

                    // Comprehensive validation for required fields
                    if (!id || !name || !slug || !productCount || !icon || !tags || !image) {
                        return res.status(400).json({ error: 'Missing required fields in one or more categories.' });
                    }

                    // Your additional validation logic can be added here

                    const newCategory = new Category(category);
                    return await newCategory.save();
                })
            );

            res.status(201).json({ message: 'Categories created successfully', categories: newCategories });
        } catch (error) {
            console.error('Error creating categories:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
