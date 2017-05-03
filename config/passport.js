const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


// ======================================
// Sign in using Email and Password.
//
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, `Email ${email} not found.`);
    }
    user.comparePassword(password)
      .then((isMatch) => {
        if (isMatch) done(null, user);
        else done(null, false, 'Invalid email or password.');
      }).catch(err => done(err));
  });
}));


// ======================================
// Login required middleware
// Taken from github.com/jaredhanson/connect-ensure-login
//
exports.ensureLoggedIn = (options = {}) => {
  if (typeof options === 'string') {
    options = { redirectTo: options };
  }

  const url = options.redirectTo || '/login';
  const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect(url);
    }
    next();
  };
};
