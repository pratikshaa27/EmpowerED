// require("dotenv").config();/////

var createError = require('http-errors');
var express = require('express');
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({ path: "config.env" })

// var http=require('http').Server(app);/////
// const paymentRoute = require('./routes/paymentRoute');/////
var path = require('path');
const flash = require('connect-flash');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
//////////
const expressSession = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const passport = require('passport');

var app = express();
// app.use('/',paymentRoute); /////

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json())
////////
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret:"hey hey hey",
}));

app.use(flash());
// Add middleware to make flash messages available to templates
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());
//////////

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
