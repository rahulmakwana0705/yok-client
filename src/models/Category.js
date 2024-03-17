const mongoose = require('mongoose');

let Category

try {
    Category = mongoose.model('Category');
} catch (error) {

    const categorySchema = new mongoose.Schema({
        id: { type: Number, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        productCount: { type: Number, required: true },
        icon: { type: String, required: true },
        tags: [{ type: String, required: true }],
        image: {
            id: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            original: { type: String, required: true },
        },
    }, { timestamps: true });
    Category = mongoose.model('Category', categorySchema);
}

module.exports = Category;
