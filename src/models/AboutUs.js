// server/models/PrivacyPolicy.js
const mongoose = require("mongoose");

let AboutUs;

try {
	AboutUs = mongoose.model("AboutUs");
} catch (error) {
	const AboutUsSchema = new mongoose.Schema(
		{
			content: {
				type: String,
				required: true,
			},
			bannerImage: {
				type: String, // Assuming the image is stored as a URL or file path
				required: false, // Adjust as needed
				default: null,
			},
			bannerHeading: {
				type: String,
				required: false, // Adjust as needed
				default: null,
			},
		},
		{ timestamps: true }
	);

	AboutUs = mongoose.model("AboutUs", AboutUsSchema);
}

module.exports = AboutUs;
