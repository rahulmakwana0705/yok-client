import mongoose from 'mongoose';

let FindUsHere;

try {
    FindUsHere = mongoose.model('FindUsHere');
} catch {
    const FindUsHereSchema = new mongoose.Schema({
        email: { type: String },
        phone: { type: String },
        address: { type: String },
    }, { timestamps: true });
    FindUsHere = mongoose.model('FindUsHere', FindUsHereSchema);
}

export default FindUsHere;
