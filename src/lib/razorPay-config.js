
import Razorpay from 'razorpay';
import RazorpayKeys from '../models/RazorpayKeys';

async function getActiveRazorpayKeys() {
    try {
        const activeKeys = await RazorpayKeys.findOne({ isActive: true });
        return activeKeys;
    } catch (error) {
        console.error('Error fetching active Razorpay keys:', error);
        throw new Error('Internal Server Error');
    }
}

export async function getRazorpayInstance() {
    try {
        const activeKeys = await getActiveRazorpayKeys();

        const razorpayInstance = new Razorpay({
            key_id: activeKeys.key,
            key_secret: activeKeys.secret,
        });

        return razorpayInstance;
    } catch (error) {
        console.error('Error creating Razorpay instance:', error);
        throw new Error('Internal Server Error');
    }
}
