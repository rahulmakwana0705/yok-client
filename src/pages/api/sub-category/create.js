import connectToDatabase from '../../../lib/mongodb';
import CategoryMenu from '../../../models/SubCategory';
import Cors from 'micro-cors';
import corsMiddleware from '../../../lib/cors';

const cors = Cors();

connectToDatabase();

async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { id, path, label, columns, _id } = req.body;
                console.log(columns)

                // Create a new category menu object
                const newCategoryMenu = new CategoryMenu({
                    id,
                    path,
                    label,
                    columns: columns.map(column => ({
                        id: column.id,
                        columnItems: column.columnItems.map(columnItem => ({
                            id: columnItem.id,
                            path: columnItem.path,
                            label: columnItem.label,
                            columnItemItems: columnItem.columnItemItems.map(columnItemItem => ({
                                id: columnItemItem.id,
                                path: columnItemItem.path,
                                label: columnItemItem.label
                            }))
                        }))
                    }))
                });

                // Save the category menu to the database
                const savedCategoryMenu = await newCategoryMenu.save();

                res.status(200).json({ success: true, message: 'submenu Created Successfully.', savedCategoryMenu });

            } catch (error) {
                console.error('Error saving CategoryMenu:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}

export default cors(handler);
