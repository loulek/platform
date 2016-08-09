var mongoose = require('mongoose');

var calendarSchema = mongoose.Schema({
	startDate: { 
		type: Date,
		required: true
	},
	endDate: {
		type: String,
		required: Date
	}
});

module.exports = mongoose.model('Calendar', calendarSchema);