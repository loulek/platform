var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
	client   	    : { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
	profile			: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
	message			: { type: String, required: false },
});

module.exports = mongoose.model('Notification', eventSchema);
