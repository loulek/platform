var express = require('express');
var router = express.Router();
var User = require('../models/user');

var path = require('path');

module.exports = function(passport) {

	// POST process signup
	router.post('/signup', function(req, res, next) {
		if (req.body.password !== req.body.repeatPassword){
			return next("Passwords did not match")
		}
		var user = new User ({
			email : req.body.email,
			password : User.generateHash(req.body.password),
			type: req.body.type
		})
		user.save(function(err, user){
			if(err) {
				return next(err)
			}
			res.json({status: 'ok', user: user})
		});
	});

	// POST process login 
	router.post('/login', passport.authenticate('local'), function(req, res, next) {
				return res.json({status: 'ok', user: req.user});
	});

	// GET logout user
	router.post('/logout', function(req, res) {
		req.logout();
		res.json({success: true});
	});
	
	router.get('/', function(req, res){

	})

	// POST check if user is authenticated THIS IS THE WALL
	router.post('/isauthenticated', function(req, res) {
		if(req.user) {
			req.json({auth: true});
		} else {
			req.json({auth: false});
		}
	});

	// POST auth main
	router.post('/auth-user', function(req, res) {
		if(req.user) {
			res.json({auth: true});
		} else {
			res.json({auth: false});
		}
	});

	return router;
};
