var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var sg = require('sendgrid')(process.env.SENDGRID_APIKEY);
var helper = require('sendgrid').mail;


function makeid()
{
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i=0; i < 7; i++){
		text += possible.chartAt(Math.floor(Math.random() * possible.length));
	}

	return text; 
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

var sendEmail = function(options) {
	from_email = new helper.Email("louisbiret@gmail.com")
	to_email = new helper.Email(options.email)
	subject = "Email de confirmation"
	var id = randomString(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
	content = new helper.Content("text/html", "Afin de valider votre inscription, veuillez ouvrir ce lien: <a href='http://localhost:3000/'" + id + ">Link</a>");

	mail = new helper.Mail(from_email, subject, to_email, content)

	var requestBody = mail.toJSON()

	console.log(requestBody)
	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: requestBody
	})
	sg.API(request, function (error, response) {
	  console.log(response.statusCode)
	  console.log(response.body)
	  console.log(response.headers)
	})
}

module.exports = function(passport) {

	// POST process signup
	router.post('/signup', function(req, res, next) {
		if (req.body.password !== req.body.repeatPassword){
			return next("Passwords did not match")
		}
		sendEmail({
			email: req.body.email
		});
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

	router.post('/workersignup', function(req, res, next) {
		if (req.body.password !== req.body.repeatPassword){
			return next("Passwords did not match")
		}
		sendEmail({
			email: req.body.email
		});
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
