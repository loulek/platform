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
var accountSid = "AC6093bbdfa15ca4cefb14aaaf2e2efd0a";
var authToken = "0046ab3cbc02563247711f02a3f38ca2";
var fromNumber = "18562834354";
var twilio=require('twilio')
var client = new twilio.RestClient(accountSid, authToken);



//POST from main to mongoose
//
// This route creates a new event in mongoose
//
// @param: title: title of the event to be created
// ...
router.post('/event/new',function(req,res){
  console.log("This is the body I got:", req.body);

  geocoder.geocode(req.body.address, function(err, data) {
console.log("data", data)
if(!data){
      return res.status(500).json({
          "success" : false,
          "error" : "Merci d'indiquer une adresse"});
    } else {
    var longitude_new = data[0].longitude;
    var latitude_new = data[0].latitude;
  }

    new Event({
      address: req.body.address,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startHour: req.body.startHour,
      endHour: req.body.endHour,
      workerNumber: req.body.workerNumber,
    })
    .save(function(err, e){
      if (err){
        console.log("error", err);
        return res.status(500).json({
          "success" : false,
          "error" : err});
      }
      return res.status(200).json({
        "success" : true,
        "event": e._id
      });
    });

  });

});


router.post('/findProfile',function(req,res){
   req.body.criteria1=JSON.parse(req.body.criteria1)
   req.body.criteria2=JSON.parse(req.body.criteria2)
   var c1=req.body.criteria1;
   var c2=req.body.criteria2
   if (c2.length===0){c2=["Accueil événementiel","Accueil entreprise","Animation commerciale","Serveur","Voiturier","Barman"]}
   if (c1.length==0){c1=["English","Italiano","Français"]}
  console.log("INSIDE, filters",c1, c2)
  geocoder.geocode(req.body.address, function(err, data) {
    var longitude_new = data[0].longitude;
    var latitude_new = data[0].latitude;
    Profile.find( { specialty: { $in: c1 },job: { $in: c2 },location: {
             $near: [longitude_new, latitude_new],
             $maxDistance: 50
         } }, function(err,users){
      console.log("USERS,users", users)

      if (err){res.status(500).send("WRONG")}
      res.send(users)
    })

  })

})

router.post('/contact',function(req,res){

  client.messages.create({
    body: req.body.message,
    to: "123"+req.body.num,
    from: fromNumber
}, function(err, message) {
    if (err) {res.send(err)};
    res.json({success:true})
});


})


// GET /event/:id
//  This route retrieves an event by its Id and all the informations with it.
router.get('/event/:id',function(req,res){
  console.log("This is the body I got2222:", req.body);

  Event.findById(req.params.id, function(err, event){
    if(err) return res.status(500).json({
      "success": false,
      "error": err
    })
    return res.status(200).json({
      "success": true,
      "event": event
    })
  })

});

router.get('/profile/:id', function(req, res){
  console.log("inside backend")
  Profile.findById(req.params.id, function(err, user){
    if(err) return res.status(500).json({
      "success": false,
      "error": err
    })
    return res.status(200).json({
      "success": true,
      "user": user
    })
  })
});


router.post('/search', function(req, res){
  console.log("REQUEST>BODY ADDREs", req.body.address);
  if (req.body.address){
   geocoder.geocode(req.body.address, function(err, data) {
         var longitude_new = data[0].longitude;
         var latitude_new = data[0].latitude;
         console.log("nlllllllllllll", longitude_new)
         Profile.find(
    {location: {
             $near: [longitude_new, latitude_new],
             $maxDistance: 50
         } || null},function(err,users){
           if (err){console.log(err); res.status(500).send("SOMETHING WRONG HERE")}
           res.send(users)
         })
    })}
    else{
      res.send({error:"invalid address"})
    }
})



router.get('/confirmed/:id', function(req, res, next){
  console.log("I AM IN CONFIRMEEEEDDD GOT HERE YOOOOO")

  var confirmId = req.params.id;

  // find user by token
  // update them
  User.findOne({confirmId : confirmId}, function(err, user){
    console.log("USERRRRRRRCONFIRM", user)
    user.confirmed = true;
    user.save(function(err, e){
      if (err){
        console.log("error", err);
        return res.status(500).json({
          "success" : false,
          "error" : err});
      }
      return res.redirect('/#/login');
    });
    console.log("I AM BOUt TO REDIRECT HERE YOOOOO")
  })

})

// //redirecting to search with address
// router.post('/user/findusers',function(req,res){
//   console.log("INSIDE FINDDDDDDD", req.body)
//   geocoder.geocode(req.body.address, function(err, data) {
//      var longitude_new = data[0].longitude;
//      var latitude_new = data[0].latitude;
//      console.log("nlllllllllllll", longitude_new)
//      Profile.find(
// {location: {
//              $near: [longitude_new, latitude_new],
//              $maxDistance: 100
//          }},function(err,users){
//            if (err){console.log(err); res.status(500).send("SOMETHING WRONG HERE")}
//            res.send(users)
//          })
// })
// })


module.exports = router;
