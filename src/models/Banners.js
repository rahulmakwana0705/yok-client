const mongoose = require('mongoose');

let Banner;

try {
    Banner = mongoose.model('Banner');
} catch (error) {
    const bannerSchema = new mongoose.Schema({
        title: { type: String, required: true },
        slug: { type: String, required: true },
        image: {
            mobile: {
                url: { type: String, required: true },
                width: { type: Number, default: 900 },
                height: { type: Number, default: 540 },
            },
            desktop: {
                url: { type: String, required: true },
                width: { type: Number, default: 1920 },
                height: { type: Number, default: 900 },
            },
        },
    }, { timestamps: true });

    Banner = mongoose.model('Banner', bannerSchema);
}

module.exports = Banner;
