var express = require('express');
var router = express.Router();
var User = require('../models/user');

var path = require('path');

module.exports = function(passport) {

	// POST process signup
	router.post('/signup', function(req, res) {
		passport.authenticate('local-signup', function(err, user, info) {
			if(err) {
				return res.json({status: 'error', error: err.toString()});
			}
			req.logIn(user, function(err) {
				if (err) {
					return res.json({status: 'error', error: err.toString()});
				}
				return res.json({status: 'ok'});
			});

		})(req, res);
	});

	// POST process login
	router.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if (err) { 
				return res.json({status: 'error', error: err});
			}

			if (!user) {
				return res.json({status: 'error', error: 'Username or password is incorrect.'});
			}

			req.logIn(user, function(err) {
				if (err) {
					return res.json({status: 'error', error: err});
				}
				return res.json({status: 'ok', user: user, info: info});
			});
		})(req, res);
	});

	// GET logout user
	router.post('/logout', function(req, res) {
		req.logout();
		res.json({success: true});
	});

	// POST check if user is authenticated
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
