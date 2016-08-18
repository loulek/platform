var mongoose = require('mongoose');

var ceventSchema = mongoose.Schema({
	user   	: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	startHour		: String,
	endHour     	: String
});

module.exports = mongoose.model('CEvent', ceventSchema);
