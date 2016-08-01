var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
	organizer   	: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	creator	 		: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	location		: String,
	summary	 		: String,
	description 	: String,
	start	   		: { date: Date, timeZone: String },
	end		 		: { date: Date, timeZone: String },
	endUndecided	: {type: boolean},
	visibility  	: String,
	attendees   	: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	ommitAttendees  : Boolean,
	attachments		: [{'url': String, title: String, fileId: String}],
	updatedAt   	: { type: Date, default: Date.now },
	createdAt   	: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);