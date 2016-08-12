var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Client = require('../models/client')
var Profile = require('../models/profile');
var NodeGeocoder = require('node-geocoder');
var Event = require('../models/event');
var Notification = require('../models/notification');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY,
  httpAdapter: "https",
  formatter: null
});
var aws = require('aws-sdk');
var Availability=require('../models/Availability')

// require multer
var multer = require('multer');
var multerS3 = require('multer-s3');

// require s3
var options = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY
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
});

router.post('/url/to/upload', upload.single('resu'), function(req, res, next) {
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
});

//TODO: FIND USERS GIVEN USER INPUT
router.post('/user/find',function(req,res){
  var address="philadelphia"
  geocoder.geocode(address, function(err, data) {
    var longitude_new = data[0].longitude;
    var latitude_new = data[0].latitude;
    console.log("nlllllllllllll", longitude_new)
    Profile.find(
     {location: {
       $near: [longitude_new, latitude_new],
       $maxDistance: 100
     }},function(users,err){
      if (err){console.log(err); res.status(500).send("SOMETHING WRONG HERE")}
      res.send(users)
    })
  })
})

router.post("/sendDayAndTime",function(req,res){
    req.body.time =JSON.parse(req.body.time)
    var day = req.body.day;
    var time = req.body.time;
    var user = req.user._id;
    console.log("INSIDE AJAX SEND DAY AND TIME", time)
    Availability.findOne({user:req.user.profile},function(err,a){
        console.log("AAAAAAAAA",req.user.profile)
        if(!a){
            var aa = new Availability({
                times: [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                ],
                user: req.user.profile
            })
            aa.save(function(err,aa){
                if (err){
                    console.log("creation error", err);
                    res.json({success:false,error:err})
                }
                console.log("aa",aa)
                var id = aa._id
                var newModel = aa
                console.log(newModel.times[day])
                var timesInThatDay=newModel.times[day];
                console.log("timesInThatDay",timesInThatDay)
                for (var i=0;i<time.length;i++){
                    console.log("timesiii",time[i]);
                    console.log("timeiiiiii2",timesInThatDay)
                    newModel.times[day][time[i]] = 1;
                }
                Availability.findByIdAndUpdate(id, newModel,function(err){
                    if (err){res.json({success:false,error:err})}
                    else{res.json({success:true})}
                })
            })
        }
        else{
        
                var id=a._id
                var newModel = a
                for (var i=0;i<time.length;i++){
                    console.log("timesiii",time[i]);
                    newModel.times[day][time[i]] = 1;
                }
                Availability.findByIdAndUpdate(id, newModel,function(err){
                    if (err){res.json({success:false,error:err})}
                    else{res.json({success:true})}
                })
            }
        });
})

// returns user object with profile information
router.post('/user/profile', function(req, res) {
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

router.get('/notifications', function(req, res){
  console.log("INSIDE NOTIFICATIONS ROUTE");
  Notification.find({
    profile: req.user.profile._id
  })
  .populate('event')
  .exec(function(err, notifications){
    console.log("NOTIFICATIONS", notifications)
    if(err){res.status(500).send("error", err)}
      res.json(notifications);
  });
});

router.post('/notifications', function(req, res){
  console.log("[got this data]", req.body);
  var notification = new Notification ({
    client: req.user._id,
    profile: req.body.profile,
    event: req.body.id
  })
  .save(function(err, notifications){
    if(err){ return res.status(500).send(err)}
    return res.status(200).json({
      success: "ok"
    });
  })
})

router.get('/events',function(req,res){
  console.log("INSIDE EVENTS ROUTE");
  Event.find({
    organizer: req.user._id
  }).exec(function(err,events){
    if (err){res.status(500).send("error", err)}
    res.json(events);
  });
});

// update event information
router.post('/user/update-event', function(req, res) {
  console.log("EVEEEEEENNTTTTTTTTTTTTTTTTTTT OBJECT", req.body)

  if(req.body) {
    geocoder.geocode(req.body.address, function(err, data) {
      if(data){
        var longitude_new = data[0].longitude;
        var latitude_new = data[0].latitude;
        var location = [longitude_new, latitude_new]
      }
       Event.findByIdAndUpdate(req.body._id, {
        title: req.body.title,
        address: req.body.address,
        location:location || null,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        description: req.body.description,
        startHour: req.body.startHour,
        endHour: req.body.endHour,
        workerNumber: req.body.workerNumber
      }, function(err) {
        if(err) {
          console.log("THIS IS THE ERROR HAHAHA", err)
          return res.json({status: 'error', error: err.toString()});
        } else {
          return res.json({status: 'ok'});
        }
      })
    });
  } else {
    geocoder.geocode(req.body.address, function(err, data) {
      if(data){
        var longitude = data[0].longitude;
        var latitude = data[0].latitude;
        var location = [longitude, latitude]
      }

        var eventProfile = new Event({
          title: req.body.title,
          address: req.body.address,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          startHour: req.body.startHour,
          endHour: req.body.endHour,
          description: req.body.description,
          workerNumber: req.body.workerNumber,
          location:location || null,

        });
      })
      eventProfile.save(function(err, event) {
        if(err) {
          return res.json({status: 'error', error: err.toString()});
        } else {
          Event.findByIdAndUpdate(req.event._id, {
            event: event
          }, function(err) {
            if(err) {
              return res.json({status: 'error', error: err.toString()});
            } else {
              return res.json({status: 'ok'});
            }
          });
        }
      });
    }
  });


// update user information
router.post('/user/update-profile', function(req, res) {

  if(req.user.profile) {
    geocoder.geocode(req.body.address, function(err, data) {
      if(data){
        var longitude_new = data[0].longitude;
        var latitude_new = data[0].latitude;
        var location = [longitude_new, latitude_new]

      }

      Profile.findByIdAndUpdate(req.user.profile, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        specialty: req.body['specialty[]'],
        location:location || null,
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
      if(data){
        var longitude = data[0].longitude;
        var latitude = data[0].latitude;
        var location = [longitude, latitude]
      }

      if(req.user.type === "Profile") {
        console.log("PROFILE", Profile);
        var profile = new Profile({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          location: location || null,
          salary: req.body.salary,
          specialty: req.body.specialty,
          image: req.body.image,
          description: req.body.description,
          gender: req.body.gender,
          address: req.body.address
        })
      } if (req.user.type === "Client") {
        console.log("CLIENT", Client);

        var clientProfile = new Client({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          location: req.body.location,
          description: req.body.description,
          profileImageUrl: req.body.profileImageUrl,
          address: req.body.address
        });
      }
      clientProfile.save(function(err, client) {
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
    });
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
