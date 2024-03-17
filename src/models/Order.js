const mongoose = require('mongoose');

let Order;

try {
    Order = mongoose.model('Order');

} catch (error) {
    const orderSchema = new mongoose.Schema({
        id: { type: Number, required: true },
        tracking_number: { type: String, required: true },
        customer: { type: String, required: true },
        total: { type: Number, required: true },
        shipping_fee: { type: Number, required: true },
        payment_gateway: { type: String, required: true },
        products: [{ type: String, required: true }],
        note: { type: String },
    }, { timestamps: true });

    Order = mongoose.model('Order', orderSchema);
}


module.exports = Order;