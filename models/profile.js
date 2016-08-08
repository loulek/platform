var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
	firstName   	: {type: String, required: false},
	lastName   	 	: {type: String, required: false},
	phone       	: {type:String, required: false},
	specialty   	: {type: Array,  required: false},
	location 		: {type: [Number], index: '2d'},
	salary          : {type: Number, required: false},
	rating          : {type:Number, required: false},
    description 	: {type: String, required: false},
    gender        	: {type: String, required: false},
    profileImageUrl : {type: String, required: false},
    resumeImageUrl  : {type: String, required: false},
    address			: {type: String, required: false},
		job  	: {type: Array,  required: false},
    createdAt		: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Profile', profileSchema);
