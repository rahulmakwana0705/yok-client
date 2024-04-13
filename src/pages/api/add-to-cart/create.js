import Cart from '../../../models/Cart';
import connectToDatabase from '../../../lib/mongodb';

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { userId, productId, quantity, name, image, slug, price, itemTotal, attributes } = req.body;
            console.log('req.body', req.body);
            // Validate required fields
            if (!userId || !productId || !quantity || !name || !image || !slug || !price || !itemTotal || !attributes) {
                return res.status(400).json({ error: 'Missing required fields.' });
            }

            // Create a new cart item
            const newCartItem = new Cart({
                userId,
                productId,
                quantity,
                name,
                image,
                slug,
                price,
                itemTotal,
                attributes: {
                    size: attributes.size,
                    color: attributes.color
                }
            });

            // Save the new cart item to the database
            const savedCartItem = await newCartItem.save();

            res.status(201).json({ message: 'Cart item created successfully', cartItem: savedCartItem });
        } catch (error) {
            console.error('Error creating cart item:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}



// import Cart from '../../../models/Cart';
// import connectToDatabase from '../../../lib/mongodb';

// connectToDatabase();

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
//         try {
//             const { userId, productId, quantity, size, color } = req.body;

//             // Validate required fields
//             if (!userId || !productId || !quantity || !size || !color) {
//                 return res.status(400).json({ error: 'Missing required fields.' });
//             }

//             // Create a new cart item
//             const newCartItem = new Cart({
//                 userId,
//                 productId,
//                 quantity,
//                 size,
//                 color
//             });

//             // Save the new cart item to the database
//             const savedCartItem = await newCartItem.save();

//             res.status(201).json({ message: 'Cart item created successfully', cartItem: savedCartItem });
//         } catch (error) {
//             console.error('Error creating cart item:', error);
//             res.status(500).json({ error: 'Internal Server Error' });
//         }
//     } else {
//         res.status(405).json({ error: 'Method Not Allowed' });
//     }
// }
