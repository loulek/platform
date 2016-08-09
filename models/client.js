var mongoose = require('mongoose');

var clientSchema = mongoose.Schema({
	firstName   	: {type: String, required: false},
	lastName   	 	: {type: String, required: false},
	phone       	: {type: String, required: false},
	location 		: {type: [Number], index: '2d'},
    description 	: {type: String, required: false},
    profileImageUrl : {type: String, required: false},
    address			: {type: String, required: false},
    createdAt		: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Client', clientSchema);
