const bcrypt = require('bcrypt');
// const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  profile: {
    name: String,
    gender: String,
    location: String,
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
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
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
