var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.flash('info', 'omg');
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res) {
  req.flash('info', 'test');
  res.redirect('/');
});

module.exports = router;