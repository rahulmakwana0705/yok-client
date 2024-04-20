const mongoose = require('mongoose');

let Rating

try {
    Rating = mongoose.model('Rating');
} catch (error) {
    const ratingSchema = new mongoose.Schema({
        message: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        rating: {
            type: Number,
            required: true,
        },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        userName: { type: String, required: true },
        userEmail: { type: String, required: true }
    }, { timestamps: true });
    Rating = mongoose.model('Rating', ratingSchema);
}
module.exports = Rating;
