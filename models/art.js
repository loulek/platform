var mongoose = require('mongoose');

var artSchema = mongoose.Schema({
	profile			: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
	title		   	: {type: String, required: false},
	artist   	 	: {type: String, required: false},
	category       	: {type: String, required: false},
	location 		: {type: [Number], index: '2d'},
	price           : {type: Number, required: false},
	height          : {type: Number, required: false},
	width           : {type: Number, required: false},
    description 	: {type: String, required: false},
    artImageUrl 	: {type: String, required: false},
    address			: {type: String, required: false},
    createdAt		: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Art', artSchema);
