
import Razorpay from 'razorpay';
import PaymentGatewayKeys from '../models/PaymentGatewayKeys';

async function getActiveRazorpayKeys() {
    try {
        const activeKeys = await PaymentGatewayKeys.findOne();
        if (activeKeys.activeGateway === 'razorpay') {
            return activeKeys.razorpay;
        } else {
            return null
        }
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
