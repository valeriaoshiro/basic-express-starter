const passport = require('passport');
const User = require('../models/User');

// ======================================
// GET /login
// Login page.
//
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login',
  });
};


// ======================================
// POST /login
// Sign in using email and password.
//
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('danger', errors.map(err => err.msg));
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('danger', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', 'Success! You are logged in.');
      const redirectTo = req.session.returnTo || '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
};


// ======================================
// GET /signup
// Signup page
//
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account',
  });
};


// ======================================
// POST /signup
// Create a new local account.
//
exports.postSignup = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('firstName', 'First name cannot be empty').notEmpty();
  req.assert('lastName', 'Last name cannot be empty').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();
  if (errors) {
    req.flash('danger', errors.map(err => err.msg));
    return res.redirect('/signup');
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    role: req.body.isAdmin ? 'admin' : 'applicant',
    profile: {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      github_username: req.body.github.trim() || undefined,
      stackoverflow_username: req.body.stackoverflow.trim() || undefined,
    },
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('danger', 'Account with that email address already exists.');
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash('success', 'Account created successfully');
        res.redirect('/');
      });
    });
  });
};


// ======================================
// GET /logout
// Log out.
//
exports.logout = (req, res) => {
  req.logout();
  req.flash('info', 'Logged out successfully');
  res.redirect('/');
};


// ======================================
// GET /account
// Profile page.
//
exports.getAccount = (req, res) => {
  res.render('account/profile', {
    title: 'Account Management',
  });
};

// ======================================
// POST /account/password
// Update current password.
//
exports.postUpdatePassword = (req, res, next) => {
  req.assert('newPassword', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmNewPassword', 'Passwords do not match').equals(req.body.newPassword);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('danger', errors.map(err => err.msg));
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.comparePassword(req.body.currentPassword)
      .then((isMatch) => {
        if (!isMatch) {
          req.flash('danger', 'Current password is incorrect');
          return res.redirect('/account');
        }
        user.password = req.body.newPassword;
        user.save((err) => {
          if (err) { return next(err); }
          req.flash('success', 'Password has been changed.');
          res.redirect('/account');
        });
      }).catch(err => next(err));
  });
};


// ======================================
// POST /account/profile
// Update profile information.
//
exports.postUpdateProfile = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('danger', errors.map(err => err.msg));
    return res.redirect('/account');
  }

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user.email = req.body.email || '';
    user.profile.first_name = req.body.firstName || '';
    user.profile.last_name = req.body.lastName || '';
    user.profile.location = req.body.location || '';
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('danger', 'The email address you have entered is already associated with an account.');
          return res.redirect('/account');
        }
        return next(err);
      }
      req.flash('success', 'Profile information has been updated.');
      res.redirect('/account');
    });
  });
};


// ======================================
// POST /account/delete
// Delete user account.
//
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', 'Your account has been deleted.');
    res.redirect('/');
  });
};


// ======================================
// GET /account/unlink/:provider
// Unlink OAuth provider.
//
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', `${provider} account has been unlinked.`);
      res.redirect('/account');
    });
  });
};
