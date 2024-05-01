import axios from 'axios';
import Order from '../../../../models/Order';
import connectToDatabase from '../../../../lib/mongodb';
const crypto = require('crypto')

connectToDatabase();

const generateID = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 100000);
    const MPrefix = "T";
    const transactionID = `${MPrefix}${timestamp}${randomNum}`
    console.log(transactionID)
    return transactionID
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { totalPrice, firstName } = req.body;

            // Call the PhonePe API to initiate payment
            const phonePeResponse = await initiatePhonePePayment(firstName, totalPrice);

            // Assuming phonePeResponse contains the necessary data from PhonePe API
            // You can save this data or send it back to the client as needed

            // // Example: Save the order in your database
            // const order = new Order({
            //     totalPrice: totalPrice,
            //     user: user._id,
            //     paymentStatus: 'pending', // or whatever status you want to set initially
            //     // Other order details if needed
            // });
            // await order.save();

            // Send success response to the client
            res.status(200).json({ message: 'Payment initiated successfully', res: phonePeResponse });

        } catch (error) {
            console.error('Error creating payment:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

// Function to make a request to PhonePe API
async function initiatePhonePePayment(username, amount) {
    try {
        console.log(username, amount)
        // Construct the payload
        const payload = {
            "merchantId": "PGTESTPAYUAT",
            "merchantTransactionId": generateID(),
            "merchantUserId": "MUID123",
            "amount": 10000,
            "name": "username",
            "redirectUrl": "http://localhost:3000/api/order/phonepay/verify",
            "redirectMode": "POST",
            "callbackUrl": "http://localhost:3000/api/order/phonepay/verify",
            "mobileNumber": "9999999999",
            "paymentInstrument": {
                "type": "PAY_PAGE"
            }
        }

        // Convert payload to Base64 encoded string
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');

        // Calculate X-VERIFY header
        const saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
        const saltIndex = 1;
        const string = base64Payload + '/pg/v1/pay' + saltKey;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex')
        const checksum = sha256 + '###' + saltIndex

        // Make the API request with retry logic
        const response = await makeRequestWithRetry(base64Payload, checksum);

        // Return the response from PhonePe API
        return response.data;
    } catch (error) {
        console.error('Error initiating PhonePe payment:', error.message);
        throw error;
    }
}

async function makeRequestWithRetry(base64Payload, checksum, retryCount = 0) {
    try {
        // Make the API request
        const response = await axios.post('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
            request: base64Payload
        }, {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            }
        });

        // Return the response if successful
        return response;
    } catch (error) {
        if (error.response && error.response.status === 429) {
            // If rate limited, check for Retry-After header
            const retryAfter = error.response.headers['retry-after'];
            if (retryAfter) {
                const waitTime = parseInt(retryAfter) * 1000; // Convert to milliseconds
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                // If no Retry-After header, use exponential backoff
                const retryDelay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }

            // Retry the request with incremented retry count
            return makeRequestWithRetry(base64Payload, checksum, retryCount + 1);
        } else {
            // If not rate limited or other error, throw the error
            throw error;
        }
    }
}
