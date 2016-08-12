var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path');
var sg = require('sendgrid')(process.env.SENDGRID_APIKEY);
var helper = require('sendgrid').mail;

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

var sendEmail = function(options) {
	from_email = new helper.Email("louisbiret@gmail.com")
	to_email = new helper.Email(options.email)
	subject = "Email de confirmation"
	content = new helper.Content("text/html", "Afin de valider votre inscription, veuillez ouvrir ce lien: <a href='http://localhost:3000/confirmed/" + options.id + "'>Cliquer ici</a>");
	mail = new helper.Mail(from_email, subject, to_email, content)

	var requestBody = mail.toJSON()

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

var sendForgetEmail = function(options) {
	from_email = new helper.Email("louisbiret@gmail.com")
	to_email = new helper.Email(options.email)
	subject = "New password"
	content = new helper.Content("text/html", "Afin de changer votre email, veuillez ouvrir ce lien: <a href='http://localhost:3000/#/change/" + options.id + "'>Cliquer ici</a>");
	mail = new helper.Mail(from_email, subject, to_email, content)

	var requestBody = mail.toJSON()

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
		var id = randomString(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
		var user = new User ({
			email : req.body.email,
			password : User.generateHash(req.body.password),
			type: req.body.type,
			confirmId: id,
		})
		user.save(function(err, user){
			if(err) {
			 return res.status(500).json({
	          "success" : false,
	          "error" : err});
			}
			sendEmail({
				email: req.body.email,
				id: id
			});
			res.json({status: 'ok', user: user, redirect: '/login/'})
		});
	});

	router.post('/workersignup', function(req, res, next) {
		if (req.body.password !== req.body.repeatPassword){
			return next("Passwords did not match")
		}
		var id = randomString(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
		var user = new User ({
			email : req.body.email,
			password : User.generateHash(req.body.password),
			type: req.body.type,
			confirmId: id
		})
		user.save(function(err, user){
			if(err) {
			 return res.status(500).json({
	          "success" : false,
	          "error" : err});
			}
			sendEmail({
				email: req.body.email,
				id: id
			});
			res.json({status: 'ok', user: user, redirect: '/login/'})
		});
	});

	router.post('/forgot', function(req, res){
		var id = randomString(32, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
		User.findOne({ 'email' : req.body.email}, function(err, user){
			if (err) {
				console.log("error", err)
				 return res.status(500).json({
		          "success" : false,
		          "error" : err
		      });
			}
			sendForgetEmail({
				email: req.body.email,
				id: id
			});
			user.blocked = true;
			user.confirmId = id;
			user.save(function(err, e){
				if(err){
					console.log("error", err);
					return res.status(500).json({
						"success" : false,
						"error" : err
					})
				}
			})
			res.json({status: 'ok', user: user, redirect: '/login/'})
		})	
	});

	router.post("/newpass", function(req, res){
		console.log("req.body", req.body)		
		User.findOne({confirmId: req.body.id}, function(err, user){
			user.blocked = false;
			user.password = User.generateHash(req.body.password);
			user.save(function(err, e){
				
				if(err){
					console.log("error", err);
					return res.status(500).json({
						"success": false,
						"error": err
					})
				}
			})
			res.json({status: 'ok', user: user, redirect: '/login/'})
		})
	})

	// POST process login
	router.post('/login', passport.authenticate('local'), function(req, res, next) {
		if (req.user.confirmed && !req.user.blocked) { return res.json({status: 'ok', user: req.user});}
		else return res.status(400).json({status: 'ok', user: req.user});
	});

  router.get('/checkLoggedIn', function(req,res,next){
    if (req.user){res.send({authenticated:true, user: req.user})}
    else{res.send({authenticated:false})}
  })

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
