var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var c = require('./controllers');
var index = require('./routes/index');
var minify = require('express-minify');
var compression = require('compression');
var handlebars = require('express-handlebars');
var fs = require('fs');

// var users = require('./routes/users');

var app = express();

app.use(compression());
// app.use(minify({
//	 cache: false,
// }));

// view engine setup
var hbsParams = {
	title : 'tParted',
	extname : 'htm',
	defaultLayout : 'layout',
	layoutsDir : path.join(__dirname, 'views'),
};

app.engine('htm', handlebars(hbsParams));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'htm');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false, limit: '5mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/index.htm', index);

app.post('/register', function(req, res) {
	c.createUser(req.body, res);
});

app.post('/login', function(req, res) {
	c.authUser(req.body, res);
});

app.post('/getUsers', function(req, res) {
	c.getUsers(req.cookies.jwt, res);
});

app.post('/removeUser', function(req, res) {
	c.removeUser(req.cookies.jwt, req.body.userid, res);
});

app.post('/getCats', function(req, res) {
	c.getCats(req.cookies.jwt, res);
});

app.post('/setCats', function(req, res) {
	c.setCats(req.cookies.jwt, JSON.parse(req.body.categories), res);
});

app.post('/getUserInfo', function(req, res) {
	c.getUserInfo(req.cookies.jwt, res);
});

app.post('/getUserInfo', function(req, res) {
	c.getUserInfo(req.cookies.jwt, res);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
	console.log(err);
});

module.exports = app;
