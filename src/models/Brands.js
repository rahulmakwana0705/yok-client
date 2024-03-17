const mongoose = require('mongoose');

let Brand

try {
    Brand = mongoose.model('Brand');
} catch (error) {
    const brandSchema = new mongoose.Schema({
        id: { type: Number, required: true },
        name: { type: String, required: true },
        slug: { type: String, required: true },
        image: {
            id: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            original: { type: String, required: true },
        },
    }, { timestamps: true });
    Brand = mongoose.model('Brand', brandSchema);
}
module.exports = Brand;
