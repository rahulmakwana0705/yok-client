const mongoose = require("mongoose");

let Review;

try {
	Review = mongoose.model("Review");
} catch (error) {
	const reviewSchema = new mongoose.Schema(
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
			rating: {
				type: String,
			},
			customer: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Customer",
			},
			comment: {
				type: String,
			},
			published: {
				type: Boolean,
			},
		},
		{ timestamps: true }
	);
	Review = mongoose.model("Review", reviewSchema);
}
module.exports = Review;
