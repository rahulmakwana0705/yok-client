// import necessary modules and your FAQ model
import faq from '../../../models/FAQ';
import corsMiddleware from '../../../lib/cors';

// handler function for the delete API
async function handler(req, res) {
    await corsMiddleware(req, res, async () => {
        if (req.method === 'DELETE') {
            try {
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ error: 'FAQ ID is required for deletion' });
                }

                const deletedFAQ = await faq.findByIdAndDelete(id);

                if (!deletedFAQ) {
                    return res.status(404).json({ error: 'FAQ not found' });
                }

                res.status(200).json({ data: deletedFAQ });
            } catch (error) {
                console.error('Error deleting FAQ:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ error: 'Method Not Allowed' });
        }
    });
}

export default handler;
