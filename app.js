"use strict";
// load tools =================================================================
var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('./config/passport');
var LocalStrategy = require('passport-local');
var flash = require('connect-flash');
var app = express();
var http = require('http').Server(app);
var webpack = require('webpack');
var webpackMiddleware = require("webpack-dev-middleware");
var webpackConfig = require('./webpack.config');
var routesUnAuth = require('./routes/unauth');
var routesAuth = require('./routes/auth');
var authWall = require('./routes/authWall');
var routesUser = require('./routes/user');
var User = require('./models/user')

// express configuration ======================================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// configure database =========================================================
var connect = process.env.MONGODB_URI;
mongoose.connect(connect);


// webpack setup ==============================================================

if (process.env.NODE_ENV !== 'production') {
  var compiler = webpack(webpackConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {chunks: false}
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

// required for passport ======================================================
var mongoStore = new MongoStore({mongooseConnection: mongoose.connection});
app.use(session({ secret: 'cookie secret',
                  name: 'cookie name',
                  store: mongoStore,
                  proxy: true,
                  resave: true,
                  saveUninitialized: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



// routes =====================================================================

app.use('/', routesUnAuth);
app.use('/', routesAuth(passport));
app.use('/', authWall);  // routes below this olny for authenticated users
app.use('/', routesUser);



// error handlers==============================================================
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send("Error: " + err.message + "\n" + err);
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send("Error: " + err.message);
});

// expose app to world ========================================================
var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('Express started. Listening on %s', port);
});