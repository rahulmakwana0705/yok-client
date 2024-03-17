const mongoose = require('mongoose');

let Shop

try {
    Shop = mongoose.model('Shop');
} catch (error) {

    const shopSchema = new mongoose.Schema({
        id: { type: Number, required: true },
        owner_id: { type: Number, required: true },
        owner_name: { type: String, required: true },
        is_active: { type: Boolean, default: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        website: { type: String },
        ratings: { type: String },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String },
        cover_image: { type: String, required: true },
        logo: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    }, { timestamps: true });
    Shop = mongoose.model('Shop', shopSchema);
}

module.exports = Shop;