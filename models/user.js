var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var findOrCreate = require('mongoose-findorcreate');

// schema for the user model
var userSchema = mongoose.Schema({
    email    : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    profile  : {type: mongoose.Schema.Types.ObjectId},
    type     : {type: String, required: true},
    confirmId: {type: String, required: false},
    confirmed: {type: Boolean, default: false, required: true},	
    createdAt: {type: Date, default: Date.now}
});

userSchema.plugin(findOrCreate);

// methods ====================================================================
// hash password
userSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the mongoose user model and expose it
module.exports = mongoose.model('User', userSchema);