// load all tools =============================================================
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
var User = require('../models/user');

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify({id:user._id, type: user.type}));
});

passport.deserializeUser(function(serialized, done) {
  var deserialized = JSON.parse(serialized)
  User.findById(deserialized.id)
      .populate({
        path:'profile', 
        model: deserialized.type
      })
      .exec(function(err, user){
        console.log("USER", user)
        done(err, user);
      })
});


passport.use(new LocalStrategy({usernameField: 'email'}, function(username, password, done) {
    // Find the user with the given username 
    console.log("username", username, "pass", password)
    User.findOne({ email: username }, function (err, user) {
      // if there's an error, finish trying to authenticate (auth failed)
      if (err) {
        console.error(err);
        return done(err);
      }
      // if no user present, auth failed
      if (!user) {
        console.log(user);
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if passwords do not match, auth failed
      console.log("user.generateHash", user.validPassword(password))
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      if (user.confirmId === false){
        return done(null, false, {message: 'Please confirm your email address through the email we sent you.'})
      }
      
      // auth has has succeeded
      user.populate({
          path:'profile', 
          model: user.type
        }, function(err, user){
          console.log("USER", user)
          return done(null, user);
        })
      
  });

}));


module.exports = passport;