import mongoose from 'mongoose';

let Checkout;

try {
    Checkout = mongoose.model('Checkout');
} catch {
    const checkoutSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
            }
        ],
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        save: { type: Boolean, default: false },
        note: { type: String },
    }, { timestamps: true });
    Checkout = mongoose.model('Checkout', checkoutSchema);
}

export default Checkout;
