const mongoose = require('mongoose');

let Cart

try {
    Cart = mongoose.model('Cart');
} catch (error) {
    const CartSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: String, required: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
    }, { timestamps: true });
    Cart = mongoose.model('Cart', CartSchema);
}
module.exports = mongoose.models.Cart || mongoose.model('Cart', CartSchema);