const mongoose = require('mongoose');

let PaymentGatewayKeys;

try {

    PaymentGatewayKeys = mongoose.model('PaymentGatewayKeys');
} catch (error) {
    const PaymentGatewayKeysSchema = new mongoose.Schema({
        razorpay: {
            key: {
                type: String,
            },
            secret: {
                type: String,
            },
        },
        phonepe: {
            merchantId: {
                type: String,
            },
            secret: {
                type: String,
            },
        },
        activeGateway: {
            type: String, // 'razorpay' or 'phonepe'
            required: true,
            default: 'razorpay', // Set default to Razorpay
        },
    }, { timestamps: true });

    PaymentGatewayKeys = mongoose.model('PaymentGatewayKeys', PaymentGatewayKeysSchema);
}

module.exports = PaymentGatewayKeys;
