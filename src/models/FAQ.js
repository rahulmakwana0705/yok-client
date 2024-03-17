import mongoose from 'mongoose';

let faq;

try {
    faq = mongoose.model('faq');
} catch {
    const faqSchema = new mongoose.Schema({
        question: { type: String },
        answer: { type: String },
    }, { timestamps: true });
    faq = mongoose.model('faq', faqSchema);
}

export default faq;
