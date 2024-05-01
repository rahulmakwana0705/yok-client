import corsMiddleware from '../../../lib/cors';
import connectToDatabase from '../../../lib/mongodb';
import PaymentGatewayKeys from '../../../models/PaymentGatewayKeys';

connectToDatabase();

export default async function handler(req, res) {
    console.log("jh")
    await corsMiddleware(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { key, secret, merchantId, activeGateway } = req.body;

                // Validate required fields
                if (activeGateway === 'razorpay' && (!key || !secret)) {
                    return res.status(400).json({ error: 'Razorpay key and secret are required fields.' });
                } else if (activeGateway === 'phonepe' && (!merchantId || !secret)) {
                    return res.status(400).json({ error: 'PhonePe merchantId and secret are required fields.' });
                }

                // Check if there's an existing document
                let paymentKeys = await PaymentGatewayKeys.findOne();

                // If no document exists, create one
                if (!paymentKeys) {
                    paymentKeys = new PaymentGatewayKeys({
                        razorpay: {
                            key: key || '',
                            secret: secret || '',
                        },
                        phonepe: {
                            merchantId: merchantId || '',
                            secret: secret || '',
                        },
                        activeGateway: activeGateway,
                    });
                    await paymentKeys.save();
                } else {
                    // If a document exists, update it
                    if (activeGateway === 'razorpay') {
                        paymentKeys.razorpay = {
                            key: key || '',
                            secret: secret || '',
                        };
                    } else if (activeGateway === 'phonepe') {
                        paymentKeys.phonepe = {
                            merchantId: merchantId || '',
                            secret: secret || '',
                        };
                    }
                    paymentKeys.activeGateway = activeGateway;
                    await paymentKeys.save();
                }

                res.status(201).json({ success: true, message: 'Payment gateway keys updated successfully' });
            } catch (error) {
                console.error('Error creating/updating payment gateway keys:', error);
                res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ success: false, error: 'Method Not Allowed' });
        }
    });
}