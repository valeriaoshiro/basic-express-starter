const User = require('../models/User');


// ======================================
// GET /dashboard
// Dashboard page.
//
exports.getDashboard = (req, res, next) => {
  User.find({role: 'applicant'}).exec()
    .then((applicants) => {
      res.render('dashboard',
        {
          title: 'Dashboard',
          pageName: 'dashboard',
          applicants,
        });
    })
    .catch(err => next(err));
};

// ======================================
// GET /dashboard/:userid
// View user profile
//
exports.getUserProfile = (req, res, next) => {
  User.findOne({ _id: req.params.userid, role: 'applicant'}).exec()
    .then((user_profile) => {
      res.render('userprofile',
        {
          title: `User Profile: ${user_profile.profile.first_name} ${user_profile.profile.last_name}`,
          user_profile,
        }
      )
    })
    .catch(err => next(err));
}