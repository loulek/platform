var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
	organizer   	: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	title		    : String,
	location	 	: Array,
	startDate 	    : { type: Date},
	endDate	   		: { type: Date},
	startHour		: String,
	endHour     	: String,
	workerNumber	: Number,
	address			: String,
	description 	: String,
	hostess			: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
	updatedAt   	: { type: Date, default: Date.now },
	createdAt   	: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
