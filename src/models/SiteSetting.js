const mongoose = require('mongoose');

let StiteSetting

try {
    StiteSetting = mongoose.model('StiteSetting');
} catch (error) {

    const StiteSettingSchema = new mongoose.Schema({
        name: { type: String, required: true },
        description: { type: String, required: true },
        author: {
            name: { type: String, required: true },
            websiteUrl: { type: String, required: true },
            address: { type: String, required: true },
        },
        logo: {
            url: "/assets/images/logo.png",
            alt: "YOK",
            href: "/",
            width: 95,
            height: 30,
          },
        tags: [{ type: String, required: true }],
        image: {
            id: { type: Number, required: true },
            thumbnail: { type: String, required: true },
            original: { type: String, required: true },
        },
    }, { timestamps: true });
    StiteSetting = mongoose.model('StiteSetting', StiteSettingSchema);
}

module.exports = StiteSetting;
