var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
	organizer   	: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	creator	 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	title		    : String,
	location	 	: Array,
	startDate 	    : { date: Date, timeZone: String },
	endDate	   		: { date: Date, timeZone: String },
	startHour		: String,
	endHour     	: String,
	workerNumber	: Number,
	address			: String,
	description 	: String,
	updatedAt   	: { type: Date, default: Date.now },
	createdAt   	: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);

title: null,
				location: [],
				startDate: null,
				endDate: null,
				startHour: null,
				endHour: [],
				workers: null,
				budget: null