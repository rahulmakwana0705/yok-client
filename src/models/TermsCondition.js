// server/models/PrivacyPolicy.js
const mongoose = require('mongoose');

let TermsConditon;

try {
    TermsConditon = mongoose.model('TermsConditon');
} catch (error) {
    const termsConditionSchema = new mongoose.Schema(
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

    TermsConditon = mongoose.model('TermsConditon', termsConditionSchema);
}

module.exports = TermsConditon;
