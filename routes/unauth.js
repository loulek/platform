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
      title: req.body.title,
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


// GET /event/:id
//  This route retrieves an event by its Id and all the informations with it.
router.get('/event/:id',function(req,res){
  console.log("This is the body I got:", req.body);

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



router.post('/search', function(req, res){
  console.log("REQUEST>BODY ADDREs", req.body.address);
   geocoder.geocode(req.body.address, function(err, data) {

         var longitude_new = data[0].longitude;
         var latitude_new = data[0].latitude;
         console.log("nlllllllllllll", longitude_new)
         Profile.find(
    {location: {
             $near: [longitude_new, latitude_new],
             $maxDistance: 100
         }},function(err,users){
           if (err){console.log(err); res.status(500).send("SOMETHING WRONG HERE")}
           res.send(users)
         })
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
