var mongoose = require("mongoose");

var availabilitySchema = mongoose.Schema ({
	times: {
		type: Array
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Profile"
	}
});

module.exports = mongoose.model("Availability", availabilitySchema);
