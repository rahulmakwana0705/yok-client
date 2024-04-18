import mongoose from 'mongoose';

let Coupon;

try {
    Coupon = mongoose.model('coupon');
} catch {
    const CouponSchema = new mongoose.Schema({
        name: { type: String, required: true },
        type: { type: String, required: true },
        discount: { type: Number, required: true },
        minimumQuantity: { type: Number, required: true },
    }, { timestamps: true });

    Coupon = mongoose.model('coupon', CouponSchema);
}

export default Coupon;