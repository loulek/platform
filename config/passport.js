// load all tools =============================================================
var passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var configAuth = require('./auth');
var User = require('../models/user');

// serialize user for the session =============================================
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deserialize user ===========================================================
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// named LocalStrategy for local signup =======================================
passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // check if the user trying to signup exists
            User.findOne({ 'email' :  email }, function(err, user) {

                // if there are any errors, return the error
                if (err) {
                    return done(err);
                }

                // check if there's already a user with this email
                if (user) {
                    return done(new Error('This email is already taken.'));
                } else {

                    // if there is no user with that email, create the user
                    var newUser = new User();

                    // set user's credentials
                    newUser.email    = email;
                    newUser.password = newUser.generateHash(password);
                    // save user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }

            });    

        });

    })
);

// named LocalStrategy for local login ========================================
passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password'
    },
    function(email, password, done) {

        // check if the user trying to login exists
        User.findOne({ 'email' :  email }, function(err, user) {

            // if there are any errors, return the error
            if (err) {
                throw err;
                return done(err);
            }

            // if no user is found or password is not valid
            if (!user || !user.validPassword(password)) {
                return done(null, false);
            }

            // if all looks good, return successful user
            return done(null, user);
        });
    })
);

module.exports = passport;