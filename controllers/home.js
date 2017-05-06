
// ======================================
// GET /
// Home page.
//
exports.index = (req, res) => {
  res.render('index', { title: 'Project', pageName: 'index' });
};


// ======================================
// GET /test
// test page.
//
exports.test = (req, res) => {
  req.flash('info', 'test');
  req.flash('danger', 'test');
  res.redirect('/');
};
