const mongoose = require("mongoose");

let Report;

try {
	Report = mongoose.model("Report");
} catch (error) {
	const reportSchema = new mongoose.Schema(
		{
			productName: {
				type: String,
			},
			category: {
				type: String,
			},
			price: {
				type: Number,
			},
			quantity: {
				type: Number,
			},
			date: {
				type: String,
			},
			customer: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Customer",
			},
			location: {
				type: String,
			},
		},
		{ timestamps: true }
	);
	Report = mongoose.model("Report", reportSchema);
}
module.exports = Report;
