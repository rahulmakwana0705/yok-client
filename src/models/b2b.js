// server/models/ContactForm.js
const mongoose = require('mongoose');

let ContactForm;

try {
    ContactForm = mongoose.model('ContactForm');
} catch (error) {
    const contactFormSchema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
            },
            phone: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            numberOfShops: {
                type: String,
                required: true,
            },
            quantity: {
                type: String,
                required: true,
            },
            message: {
                type: String,
                required: true,
            },
            selectedCheckboxes: {
                type: [String],
                required: true,
            },
        },
        { timestamps: true }
    );

    ContactForm = mongoose.model('ContactForm', contactFormSchema);
}

module.exports = ContactForm;
