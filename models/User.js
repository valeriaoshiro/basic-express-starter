const bcrypt = require('bcrypt-nodejs');
// const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: { type: String, default: 'applicant' },

  // facebook: String,
  // instagram: String,
  github: String,
  tokens: Array,

  profile: {
    first_name: String,
    last_name: String,
    github_username: String,
    stackoverflow_username: String,
    resume: String
  },
}, { timestamps: true });


// ======================================
// Password hash middleware.
//
userSchema.pre('save', function(next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});


// ======================================
// Helper method for validating user's password.
//
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) reject(err);
      else resolve(isMatch);
    });
  })

};

const User = mongoose.model('User', userSchema);

module.exports = User;
