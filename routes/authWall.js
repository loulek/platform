var express = require('express');
var router = express.Router();

router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/');
  } else {
    return next();
  }
});

module.exports = router;
