import FindUsHere from '../../../models/FindUsHere';
import Cors from 'micro-cors';
import corsMiddleware from '../../../lib/cors';

const cors = Cors({
    allowMethods: ['PUT', 'OPTIONS'],
});

async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'PUT') {
            try {
                const { _id, email, phone, address } = req.body;

                const updatedData = await FindUsHere.findByIdAndUpdate(_id, { email, phone, address }, { new: true });

                if (!updatedData) {
                    return res.status(404).json({ error: 'Data not found' });
                }

                res.status(200).json({ data: updatedData });
            } catch (error) {
                console.error('Error updating data in FindUsHere:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}

export default cors(handler);

