const mongoose = require('mongoose');

let Cart

try {
    Cart = mongoose.model('Cart');
} catch (error) {
    const CartSchema = new mongoose.Schema({
        userId: { type: String, required: true },
        productId: { type: String, required: true },
        quantity: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
    }, { timestamps: true });
    Cart = mongoose.model('Cart', CartSchema);
}
module.exports = Cart;
