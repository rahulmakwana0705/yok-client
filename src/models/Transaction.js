const mongoose = require("mongoose");

let Transaction;

try {
	Transaction = mongoose.model("Transaction");
} catch (error) {
	const transactionSchema = new mongoose.Schema(
		{
			email: {
				type: String,
			},
			payment: {
				type: Number,
			},
			status: {
				type: boolean,
			},
		},
		{ timestamps: true }
	);
	Transaction = mongoose.model("Transaction", transactionSchema);
}
module.exports = Transaction;
