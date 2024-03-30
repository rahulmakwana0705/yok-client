const mongoose = require('mongoose');

let Cart;

try {
    Cart = mongoose.model('Cart');
} catch (error) {
    const CartSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        slug: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        itemTotal: { type: Number, required: true },
        attributes: {
            size: { type: String },
            color: { type: String }
        },
    }, { timestamps: true });
    Cart = mongoose.model('Cart', CartSchema);
}

module.exports = mongoose.models.Cart || mongoose.model('Cart', CartSchema);