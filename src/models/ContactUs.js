import mongoose from 'mongoose';

let ContactUs;

try {
    ContactUs = mongoose.model('ContactUs');
} catch {
    const ContactUsSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String },
        message: { type: String },
    }, { timestamps: true });
    ContactUs = mongoose.model('ContactUs', ContactUsSchema);
}

export default ContactUs;
