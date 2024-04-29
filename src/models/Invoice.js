const mongoose = require("mongoose");

let Invoice;

try {
	Invoice = mongoose.model("Invoice");
} catch (error) {
	const invoiceSchema = new mongoose.Schema(
		{
			customer: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Customer",
			},
			create: {
				type: String,
			},
			due: {
				type: String,
			},
			amount: {
				type: Number,
			},
		},
		{ timestamps: true }
	);
	Invoice = mongoose.model("Invoice", invoiceSchema);
}
module.exports = Invoice;
