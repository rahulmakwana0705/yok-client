const mongoose = require('mongoose');

let RazorpayKeys

try {
    RazorpayKeys = mongoose.model('RazorpayKeys');
} catch (error) {
    const RazorpayKeysSchema = new mongoose.Schema({
        key: {
            type: String,
            required: true,
        },
        secret: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true });
    RazorpayKeys = mongoose.model('RazorpayKeys', RazorpayKeysSchema);
}
module.exports = RazorpayKeys;
