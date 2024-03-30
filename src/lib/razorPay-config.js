import Razorpay from 'razorpay';


export const razorPay = new Razorpay({
    key_id: process.env.NEXT_RAZORPAY_KEY,
    key_secret: process.env.NEXT_RAZORPAY_SECERET,
});