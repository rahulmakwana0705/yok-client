const express = require('express');
const router = express.Router();
const Cart = require('../../../models/Cart');

// POST API to add a new item to the cart
router.post('/add-to-cart', async (req, res) => {
    try {
        const { userId, productId, quantity, size, color } = req.body;

        // Validate required fields
        if (!userId || !productId || !quantity || !size || !color) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        // Create a new cart item
        const newCartItem = new Cart({
            userId,
            productId,
            quantity,
            size,
            color
        });

        // Save the new cart item to the database
        const savedCartItem = await newCartItem.save();

        res.status(201).json({ message: 'Cart item created successfully', cartItem: savedCartItem });
    } catch (error) {
        console.error('Error creating cart item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
