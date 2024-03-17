import mongoose from 'mongoose';


let UserDetails;

try {
    UserDetails = mongoose.model('UserDetails');
} catch {

    const userDetailsSchema = new mongoose.Schema({
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        DisplayName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        Gender: { type: String, required: true },
    }, { timestamps: true });
    UserDetails = mongoose.model('UserDetails', userDetailsSchema);
}

export default UserDetails;
