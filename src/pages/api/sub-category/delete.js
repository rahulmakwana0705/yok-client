import corsMiddleware from '../../../lib/cors';
import connectToDatabase from '../../../lib/mongodb';
import CategoryMenu from '../../../models/SubCategory';

connectToDatabase();

export default async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { id } = req.body;

                // Check if ID is provided
                if (!id) {
                    return res.status(400).json({ error: 'SubMenu ID is required' });
                }

                // Find the SubMenu by ID
                const SubMenu = await CategoryMenu.findByIdAndDelete(id);

                // Send a success response
                res.status(200).json({ message: 'SubMenu deleted successfully' });
            } catch (error) {
                console.error('Error deleting SubMenu:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }

        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    })
}
