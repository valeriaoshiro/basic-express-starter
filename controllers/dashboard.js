const User = require('../models/User');


// ======================================
// GET /dashboard
// Dashboard page.
//
exports.getDashboard = (req, res) => {
  User.find({role: 'applicant'}).exec()
    .then((applicants) => {
      res.render('dashboard',
        {
          title: 'Dashboard',
          pageName: 'dashboard',
          applicants,
        });
    });
};