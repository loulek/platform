var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Profile = require('../models/profile');
var NodeGeocoder = require('node-geocoder');
var Event = require('../models/event');
var geocoder = NodeGeocoder({
 provider: "google",
 apiKey: process.env.GEOCODING_API_KEY,
 httpAdapter: "https",
 formatter: null
});
var aws = require('aws-sdk');

// require multer
var multer = require('multer');
var multerS3 = require('multer-s3');

// require s3
var options = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  logger: console
  // region: "oregon",
  // NEEDED for Buckets in Frankfurt (and change region)
  // signatureVersion: 'v4',
  // s3DisableBodySigning: true
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
};

// create s3 client
var s3 = new aws.S3(options);

// create multer object
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'joshmagic',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "_" + file.originalname);
    }
  })
});





// POST to `/uploadFile`
//
// Upload a file to this url
//
// @note: upload.single(...) takes the name of the field you called the file on
// the client (in this example, you can see it's called 'fileName')
// @note: Doesn't matter if you used React or HTML forms to send the request
// @note: the`multer` package saves the file to the filesystem for you already,
// using `upload.single`
router.post('/url/to/upload/to', upload.single('img'), function(req, res, next) {
	// Receive file that was uploaded

	// Here, if you choose, you can send file to S3/filesystem/wherever
	console.log("Files that were uploaded: ", req.file);

	// Path of the file that was sent to server
	console.log("Relative path of the new file: ", req.file.location);

	if (req.user.profile) {
		Profile.findByIdAndUpdate(req.user.profile, {
			profileImageUrl: req.file.location
		}, function(err) {
			if(err) {
				return res.json({success: false, error: err.toString()});
			} else {
				return res.json({success: true, message: req.file.location});
			}
		});
	}
	// User.findById(req.user._id)
	// 	.populate('profile')
	// 	.exec(function(err, user){
	// 	  	if(err) res.status(400).json({success: false})

	// 	  	user.profile.profileImageUrl = req.file.location

	// 	  	user.save(function(err, u){
	// 	  		if(err) res.status(400).json({success: false})
	// 			res.status(200).json({
	// 			    success: true,
	// 			    message: req.file.location
	// 			 })
	// 	  	})
	// 	});
});
router.post('/url/to/upload', upload.single('resu'), function(req, res, next) {
	// Receive file that was uploaded

	// Here, if you choose, you can send file to S3/filesystem/wherever
	console.log("Files that were uploaded: ", req.file);

	// Path of the file that was sent to server
	console.log("Relative path of the new file: ", req.file.location);

	if (req.user.profile) {
		Profile.findByIdAndUpdate(req.user.profile, {
			resumeImageUrl: req.file.location
		}, function(err) {
			if(err) {
				return res.json({success: false, error: err.toString()});
			} else {
				return res.json({success: true, message: req.file.location});
			}
		});
	}
	// User.findById(req.user._id)
	// 	.populate('profile')
	// 	.exec(function(err, user){
	// 	  	if(err) res.status(400).json({success: false})

	// 	  	user.profile.profileImageUrl = req.file.location

	// 	  	user.save(function(err, u){
	// 	  		if(err) res.status(400).json({success: false})
	// 			res.status(200).json({
	// 			    success: true,
	// 			    message: req.file.location
	// 			 })
	// 	  	})
	// 	});
});


// returns user object with profile information
router.post('/user/profile', function(req, res) {
	console.log("REQ>USER>PROFILE", req.user.profile)
	res.json(req.user);
	// User.findById(req.user._id)
	// .populate('profile')
	// .exec(function(err, user) {
	// 	if(err) {
	// 		throw err;
	// 	} else {
	// 		return res.json(user);
	// 	}
	// });
});

router.get('/events',function(req,res){
  console.log("INSIDE EVENTS ROUTE")
  Event.find().exec(function(err,events){
    if (err){res.status(500).send("errrrrr")}
    res.json(events)
  })
})

// update user information
router.post('/user/update-profile', function(req, res) {
	if(req.user.profile) {
    geocoder.geocode(req.body.address, function(err, data) {
       var longitude_new = data[0].longitude;
       var latitude_new = data[0].latitude;

		Profile.findByIdAndUpdate(req.user.profile, {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phone,
			specialty: req.body['specialty[]'],
      		location:[longitude_new, latitude_new],
          salary: req.body.salary,
			image: req.body.image,
			description: req.body.description,
			gender: req.body.gender,
			address: req.body.address
		}, function(err) {
			if(err) {
				return res.json({status: 'error', error: err.toString()});
			} else {
				return res.json({status: 'ok'});
			}
		})
  });
	} else {
    geocoder.geocode(req.body.address, function(err, data) {
       var longitude = data[0].longitude;
       var latitude = data[0].latitude;

		var newProfile = new Profile({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phone: req.body.phone,
      		location: [longitude, latitude],
          salary: req.body.salary,
			specialty: req.body.specialty,
			image: req.body.image,
			description: req.body.description,
			gender: req.body.gender,
			address: req.body.address

	    })

		console.log('new profile: ', newProfile);
		newProfile.save(function(err, profile) {
			if(err) {
				return res.json({status: 'error', error: err.toString()});
			} else {

				User.findByIdAndUpdate(req.user._id, {
					profile: profile
				}, function(err) {
					if(err) {
						return res.json({status: 'error', error: err.toString()});
					} else {
						return res.json({status: 'ok'});
					}
				});
			}
		});
	  })
	}
});

// change user password
router.post('/user/change-password', function(req, res) {

	if(!req.body.oldPassword) {
		return res.json({status: 'error', error:'Old password cannot be empty.'});
	}

	if(!req.body.newPassword) {
		return res.json({status: 'error', error:'New password cannot be empty.'});
	}

	if(!req.body.repeatNewPassword) {
		return res.json({status: 'error', error:'Repeat new password cannot be empty.'});
	}

	if(!req.user.validPassword(req.body.oldPassword)) {
		return res.json({status: 'error', error:'Old password is not correct.'});
	}

	if(req.body.newPassword !== req.body.repeatNewPassword) {
		return res.json({status: 'error', error: "New password and repeat new password don't match"});
	}

	var newPassword = req.user.generateHash(req.body.newPassword);
	User.findByIdAndUpdate(req.user._id, {
		password: newPassword
	}, function(err) {
		if(err) {
			return res.json({status: 'error', error: err.toString()});
		} else {
			return res.json({status: 'ok'});
		}
	})
});

module.exports = router;
