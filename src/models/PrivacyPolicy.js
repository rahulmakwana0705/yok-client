// server/models/PrivacyPolicy.js
const mongoose = require('mongoose');

let PrivacyPolicy;

try {
    PrivacyPolicy = mongoose.model('PrivacyPolicy');
} catch (error) {
    const privacyPolicySchema = new mongoose.Schema(
        {
            content: {
                type: String,
                required: true,
            },
            bannerImage: {
                type: String, // Assuming the image is stored as a URL or file path
                required: false, // Adjust as needed
                default: null
            },
            bannerHeading: {
                type: String,
                required: false, // Adjust as needed
                default: null
            },
        },
        { timestamps: true }
    );

    PrivacyPolicy = mongoose.model('PrivacyPolicy', privacyPolicySchema);
}

module.exports = PrivacyPolicy;
