const mongoose = require("mongoose");

let Shipping;

try {
	Shipping = mongoose.model("Shipping");
} catch (error) {
	const shippingSchema = new mongoose.Schema(
		{
			countries: {
				type: String,
			},
			code: {
				type: String,
			},
			status: {
				type: Number,
			},
		},
		{ timestamps: true }
	);
	Shipping = mongoose.model("Shipping", shippingSchema);
}
module.exports = Shipping;
