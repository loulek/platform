var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
	client   	    : { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
	profile			: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
	event			: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
});

module.exports = mongoose.model('Notification', notificationSchema);
