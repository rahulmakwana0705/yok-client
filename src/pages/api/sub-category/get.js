import connectToDatabase from '../../../lib/mongodb';
import CategoryMenu from '../../../models/SubCategory';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Check if there is a query parameter named "id"
            if (req.query.id) {
                // Fetch specific CategoryMenu by ID from the database
                const data = await CategoryMenu.findById(req.query.id);
                if (!data) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                return res.status(200).json({ CategoryMenu: data });
            } else {
                // Fetch all CategoryMenu from the database
                const data = await CategoryMenu.find();
                return res.status(200).json({ CategoryMenu: data });
            }
        } catch (error) {
            console.error('Error fetching Category:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
