import connectToDatabase from '../../../lib/mongodb';
import CategoryMenu from '../../../models/SubCategory';
import Cors from 'micro-cors';
import corsMiddleware from '../../../lib/cors';

const cors = Cors();

connectToDatabase();

async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') { // Assuming you're using PUT for updating data
            try {
                const { id, path, label, columns, _id } = req.body;
                console.log(columns);

                // Find the document based on the provided _id and id
                const existingCategoryMenu = await CategoryMenu.findOne({ _id });

                if (!existingCategoryMenu) {
                    return res.status(404).json({ error: 'CategoryMenu not found' });
                }

                // Update the existing document
                existingCategoryMenu.set({
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

                // Save the updated document
                const updatedCategoryMenu = await existingCategoryMenu.save();

                res.status(200).json({ success: true, message: 'Submenu updated successfully', updatedCategoryMenu });

            } catch (error) {
                console.error('Error updating CategoryMenu:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}

export default cors(handler);
