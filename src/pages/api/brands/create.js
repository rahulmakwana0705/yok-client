import connectToDatabase from '../../../lib/mongodb';
import Brands from '../../../models/Brands';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const brandsData = req.body;

            if (!Array.isArray(brandsData) || brandsData.length === 0) {
                return res.status(400).json({ error: 'Invalid request format. Expected a non-empty array of brands.' });
            }

            const newBrands = await Promise.all(
                brandsData.map(async (brand) => {
                    const { id, name, slug, image } = brand;

                    // Comprehensive validation for required fields
                    if (!id || !name || !slug || !image || !image.id || !image.thumbnail || !image.original) {
                        return res.status(400).json({ error: 'Missing required fields in one or more brands.' });
                    }

                    // Your additional validation logic can be added here

                    const newBrand = new Brands(brand);
                    return await newBrand.save();
                })
            );

            res.status(201).json({ message: 'Brands created successfully', brands: newBrands });
        } catch (error) {
            console.error('Error creating brands:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
