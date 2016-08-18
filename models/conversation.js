var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')


var conversationSchema = mongoose.Schema({
client   	    : { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
profile			: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }	
});

conversationSchema.plugin(findOrCreate);
module.exports = mongoose.model('Conversation', conversationSchema);
