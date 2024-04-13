const mongoose = require('mongoose');

let Product;

try {
    // delete mongoose.connection.models['Product'];
    Product = mongoose.model('Product');
} catch (error) {
    const ProductSchema = new mongoose.Schema(
        {
            id: { type: Number },
            name: { type: String, required: true },
            sku: { type: String, default: "N/A" },
            description: { type: String, required: true },
            slug: { type: String },
            type: { type: String },
            isNewArrival: { type: Boolean, default: false },
            customizable: { type: Boolean, default: false },
            tags: [
                {
                    id: { type: Number },
                    name: { type: String },
                    slug: { type: String },
                },
            ],
            image: {
                id: { type: Number },
                thumbnail: { type: String },
                original: { type: String },
            },
            gallery: [
                {
                    id: { type: Number },
                    thumbnail: { type: String },
                    original: { type: String },
                },
            ],
            price: { type: Number, required: true },
            sale_price: { type: Number },
            quantity: { type: Number },
            category: {
                id: { type: Number },
                name: { type: String },
                slug: { type: String },
            },
            variations: [
                {
                    id: { type: Number },
                    value: { type: mongoose.Schema.Types.Mixed },
                    attribute: {
                        id: { type: Number },
                        name: { type: String },
                        slug: { type: String },
                    },
                },
            ],
            meta: [
                {
                    id: { type: Number },
                    title: { type: String },
                    content: { type: String },
                },
            ],
        },
        { timestamps: true }
    );

    Product = mongoose.model('Product', ProductSchema);
}

module.exports = Product;
