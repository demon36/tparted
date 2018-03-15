var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/tasks', function(req, res, next) {
  res.render('tasks');
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
});

router.get('/admin', function(req, res, next) {
  res.render('admin');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});


module.exports = router;
