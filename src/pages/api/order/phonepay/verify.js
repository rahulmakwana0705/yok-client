import axios from 'axios';
import connectToDatabase from '../../../../lib/mongodb';
const crypto = require('crypto');

connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const merchantId = req.body.merchantId;
            const merchantTransactionId = req.body.transactionId;

            // Calculate X-VERIFY header
            const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
            const saltIndex = 1;
            const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
            const sha256 = crypto.createHash('sha256').update(string).digest('hex');
            const checksum = sha256 + '###' + saltIndex;

            let retries = 0;
            const maxRetries = 3;
            let response;

            // Retry logic with exponential backoff
            while (retries < maxRetries) {
                try {
                    // Make the API request to check transaction status
                    response = await axios.get(`https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-VERIFY': checksum,
                            'X-MERCHANT-ID': merchantId
                        }
                    });
                    break; // If request succeeds, exit the loop
                } catch (error) {
                    if (error.response && error.response.status === 429) {
                        // If rate limited, wait and retry
                        const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                        retries++;
                    } else {
                        throw error; // Propagate other errors
                    }
                }
            }

            // Return the response from PhonePe API
            console.log(response);
            let url;
            if (response.data.success) {
                url = 'http://localhost:3000/orders'
                res.redirect(url)
            } else {
                url = 'http://localhost:3000/orders'
                res.redirect(url)
                // handle failure
            }
        } catch (error) {
            let url;
            console.error('Error checking transaction status:', error);
            url = 'http://localhost:3000/orders'
            res.redirect(url)
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
