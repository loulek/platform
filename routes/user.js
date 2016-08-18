var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Client = require('../models/client')
var Profile = require('../models/profile');
var NodeGeocoder = require('node-geocoder');
var Event = require('../models/event');
var Notification = require('../models/notification');
var Message = require('../models/message');
var Conversation = require('../models/conversation');
var Art = require('../models/art');

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
      console.log("in here");
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

router.post('/url/to/upload/to/art', upload.single('img'), function(req, res, next) {
  console.log("uploaded an image");
  if (req.user.profile) {
    Art.findByIdAndUpdate(req.user.profile, {
      profileImageUrl: req.file.location
    }, function(err) {
      console.log("[err uploading image]", err);
      if(err) {
        return res.json({success: false, error: err.toString()});
      } else {
        return res.json({success: true, message: req.file.location});
      }
    });
  } else {
    return res.json({success: true, message: req.file.location});
  }
});

router.get('/myGallery', function(req, res){
  Art.find({
    profile: req.user.profile._id
  })
  .exec(function(err, myArt){
    // console.log("ARRRT", myArt)
    if(err){res.status(500).send("error", err)}
      res.json(myArt);
  });
});


router.post('/addArt', function(req, res){
  console.log("REQ.USER.PROFILE eeeeeeee",req.user.profile)
  var art = new Art ({
    profile    : req.user.profile._id, 
    title      : req.body.title,
    artist     : req.body.artist,
    category   : req.body.category,
    price      : req.body.price,
    height     : req.body.height,
    width      : req.body.width,
    description: req.body.description,
    artImageUrl: req.body.artImageUrl,
    address    : req.body.address
  })
  .save(function(err, art){
    Profile.find({profile: req.user.profile._id}, function(err, art) {
    if(err){ return res.status(500).send(err)}
        res.status(200).json({
          success: "ok",
          art: art
        });
      })
              
  }); 
}); 

router.delete('/deleteArt/:id', function(req, res, next){
  Art.findByIdAndRemove(req.params.id, function(err){
    if(err) return next(err)
      res.json({
        success: "ok"
      })
  })
})

router.post('/updateArt/:id', function(req, res){
console.log("I AM UPDATING ART req.params.id", req.params.id)
console.log("I AM UPDATING ART req.params.id", req.params._id)

    Art.findByIdAndUpdate(req.params.id, {
        profile    : req.user.profile._id, 
        title      : req.body.title,
        artist     : req.body.artist,
        category   : req.body.category,
        price      : req.body.price,
        height     : req.body.height,
        width      : req.body.width,
        description: req.body.description,
        artImageUrl: req.body.artImageUrl,
        address    : req.body.address
    }, function(err) {
      console.log("I AM UPDATING ART 2")

        if(err) {
          return res.json({status: 'error', error: err.toString()});
        } else {
          Art.findById(req.params.id)
          .exec(function(err, art){
            if(err){
              throw err;
            } else {
              return res.json({status: 'ok', hello: art });
            }
          });
        }
      })
})

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
                console.log("LENGTH OF THE FUKING TIME",time.length)
                for (var i=0;i<time.length;i++){
                    console.log("timesiii",time[i]);
                    console.log("timeiiiiii2",timesInThatDay)
                    newModel.times[day][time[i]] = 1;
                }
                Availability.findByIdAndUpdate(id, newModel,function(err){
                    if (err){res.json({success:false,error:err})}
                    else{
						res.json({success: true, availability: newModel.times})
					}
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
                    else{res.json({success: true, availability: newModel.times})}
                })
            }
        });
})

router.post("/sendDayAndTime2",function(req,res){
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
                console.log("LENGTH OF THE FUKING TIME",time.length)
                for (var i=0;i<time.length;i++){
                    console.log("timesiii",time[i]);
                    console.log("timeiiiiii2",timesInThatDay)
                    newModel.times[day][time[i]] = 0;
                }
                Availability.findByIdAndUpdate(id, newModel,function(err){
                    if (err){res.json({success:false,error:err})}
                    else{
						res.json({success: true, availability: newModel.times})
					}
                })
            })
        }
        else{
        
                var id=a._id
                var newModel = a
                for (var i=0;i<time.length;i++){
                    console.log("timesiii",time[i]);
                    newModel.times[day][time[i]] = 0;
                }
                Availability.findByIdAndUpdate(id, newModel,function(err){
                    if (err){res.json({success:false,error:err})}
                    else{res.json({success: true, availability: newModel.times})}
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
  }); 
}); 

router.get('/user/calendar',function(req,res){
  Availability.findOne({user:req.user.profile},function(err,calendar){
    if (err){res.status(500).json("something wrong in calendar", err)}
    res.json(calendar)
  })
})

router.get('/messages', function(req, res) {

  // var query = {};

  // if (req.user.type === 'Client') {
  //   query['client'] = req.user.profile._id;
  // }
  // else if (req.user.type === 'Client') {
  //   query['profile'] = req.user.profile._id;
  // }

  Conversation.find({$or:[{profile:req.user.profile._id},{client:req.user.pro}]}, function(err, conversations) {
    res.json(conversations)
  })
})
router.post('/sendMessage', function(req, res) {
   console.log("REQ.USER", req.user);
   console.log("REQ.USER.PROFILE.ID", req.user.profile._id);
   console.log("REQ.BODY.USER.ID", req.body['user[_id]']);
   console.log("Req.body..", req.body);

   req.body = JSON.parse(req.body.data);

  var query = {};

  if (req.user.type === 'Client') {
    query['client'] = req.user.profile._id;
    query['profile'] = req.body.art.profile;
  }

  if (req.user.type === 'Profile') {
    query['profile'] = req.user.profile._id;
    query['client'] = req.body.art.profile;
  }

  console.log(query, 'query')


  Conversation.findOrCreate(query, query,
  function(err, conversation) {
    console.log("AM I HERE IN MONGOOSE?")
    if (err) return res.status(500).send({success: false, error: console.log("Error", err)});
    return res.json({
      success:true,
      redirect: '/conversation/' + conversation._id
    })
  })
    console.log("SUCCESS ENDING OF THE AJAX")

})

router.post('/sendMessage/:id', function(req, res) {
   console.log("REQ.USER", req.user);
   console.log("REQ.USER.PROFILE.ID", req.user.profile._id);
   console.log("REQ.BODY.USER.ID", req.body['user[_id]']);

  Conversation.findById(req.params.id,
  function(err, conversation) {
    console.log("AM I HERE IN MONGOOSE SENDING A MESSAGE")
    if (err) return res.status(500).send({success: false, error: console.log("Error", err)});
    var message = new Message({
      from          : req.user._id,
      to            : req.user._id === conversation.profile ? conversation.client : conversation.profile,
      message       : req.body.message,
      time          : new Date(),
      conversationId:req.params.id
    })
    message.save(function (err, message){
      if(err) return res.status(500).send({success: false, error: console.log("Error", err)});
     Message.find({
       conversationId: req.params.id
     }, function(err, mesgs){
      if(err) return res.status(500).send({success: false, error: console.log("Error", err)});
         return res.json({
          success:true,
          msgs: mesgs
        })
     })
    })
    
  })
    console.log("SUCCESS ENDING OF THE AJAX")

})

router.get('/conversation/:id', function(req, res){
  Message.find({
        conversationId: req.params.id
      }).exec(function(err, messages){
        if(err){res.status(500).send("error", err)}
          res.json(messages);
      });
 
});

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
      if(req.user.type === "Profile") {
        console.log("REQ.USERRR DEBUG NIGHT TESTING PURPOSEE", req.user)
        Profile.findByIdAndUpdate(req.user.profile, {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          specialty: req.body['specialty[]'],
          location:location || null,
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
      } else if (req.user.type === "Client") {
        console.log("REQ.USERRR DEBUG NIGHT", req.user)
        Client.findByIdAndUpdate(req.user.profile, {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          specialty: req.body['specialty[]'],
          location:location || null,
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
      }
    });
  } else {
    geocoder.geocode(req.body.address, function(err, data) {
      if(data){
        var longitude = data[0].longitude;
        var latitude = data[0].latitude;
        var location = [longitude, latitude]
      }

      if(req.user.type === "Profile") {
        // console.log("PROFILE", Profile);
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
        // console.log("CLIENT", Client);
        var profile = new Client({
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
        });
      }

      profile.save(function(err, profile) {
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
