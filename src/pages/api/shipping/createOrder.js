import axios from 'axios';
import connectToDatabase from '../../../lib/mongodb';
import { loginToShiprocket } from '../../../lib/ship-rocket-config';
connectToDatabase();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Extract necessary data from the request body
            const { user, products, totalPrice, shippingAddress } = req.body;

            // Log in to Shiprocket to obtain the authorization token
            const token = await loginToShiprocket(process.env.SHIPROCKET_EMAIL, process.env.SHIPROCKET_PASSWORD);

            // Prepare order data for Shiprocket API
            const orderData = {
                // Populate order data according to Shiprocket's requirements
                // You need to customize this part based on your actual data structure and requirements
                "order_id": "224-447",
                "order_date": "2024-04-08 11:11",
                "pickup_location": "Home", //Primary
                "billing_customer_name": shippingAddress.firstName, // Use shipping address details for billing
                "billing_last_name": shippingAddress.last_name,
                "billing_address": shippingAddress.address,
                "billing_city": shippingAddress.city,
                "billing_pincode": shippingAddress.pincode,
                "billing_state": shippingAddress.state,
                "billing_country": shippingAddress.country,
                "billing_email": user.email, // Use user's email for billing
                "billing_phone": shippingAddress.phone,
                "shipping_is_billing": true,
                "order_items": products.map(product => ({ // Map products to order items
                    "name": product.name,
                    "sku": product.sku,
                    "units": product.quantity,
                    "selling_price": product.price,
                    // Add more fields as needed
                })),
                "payment_method": "Prepaid", // Assuming all orders are prepaid
                "sub_total": totalPrice,
                "length": 10,
                "breadth": 15,
                "height": 20,
                "weight": 2.5
                // Add more fields as needed
            };

            console.log(orderData)

            // Make a POST request to Shiprocket API to create a custom order
            const config = {
                method: 'post',
                url: 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                data: orderData
            };

            const response = await axios(config);

            // Handle the response from Shiprocket API
            console.log('Response from Shiprocket:', response.data);
            // this response has shipping order id and shipping id need to store in db where is order is stored

            // Handle any other logic related to the order creation in your system

            res.status(200).json({
                success: true,
                shiprocketResponse: response.data
            });
        } catch (error) {
            console.error('Error creating order:', error.response.data);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
