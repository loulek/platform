var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
	from   	    : { type: mongoose.Schema.Types.ObjectId },
	to			: { type: mongoose.Schema.Types.ObjectId },
	message			: { type: String },
	time 			: { type: Date },
	conversationId	: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true}
});

module.exports = mongoose.model('Message', messageSchema);
