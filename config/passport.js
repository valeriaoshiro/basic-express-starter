const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

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

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

// ======================================
// GITHUB Login Strategy
//
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: "/auth/github/callback",
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ github: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('danger', 'There is already a Github account that belongs to you. Sign in with that account or delete it, then link it with your current account');
        done(err);
      } else {
        User.findById(req.user.id, (err, user) => {
          if (err) { return done(err); }
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken });
          user.save((err) => {
            req.flash('info', 'Github account has been linked');
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ github: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      console.log(JSON.stringify(profile));
      User.findOne({ email: profile.emails[0].value }, (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('danger', 'There is already an account using this email address. Sign in to that account and link it with github manually from Account Settings');
          done(err);
        } else {
          const user = new User();
          user.email = profile.emails[0].value;
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken });
          user.profile.first_name = profile.name.givenName;
          user.profile.last_name = profile.name.familyName;
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));