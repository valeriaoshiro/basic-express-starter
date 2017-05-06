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
  const role = options.role;
  const setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

  return (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (setReturnTo && req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.redirect(url);
    }
    else if (role && role !== req.user.role) {
      req.flash('danger', 'You do not have permissions to access this page');
      return res.redirect('/');
    }
    next();
  };
};

// ======================================
// Authorization Required middleware.
//
exports.isAuthorized = provider => (
  (req, res, next) => {
    const token = req.user.tokens.find(t => t.kind === provider);
    if (token) {
      next();
    } else {
      if (req.session) req.session.returnTo = req.originalUrl || req.url;
      res.redirect(`/auth/${provider}`);
    }
  }
);
