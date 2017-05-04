// Load environment variables, where API keys and passwords are configured.
require('dotenv').load({ path: '.env.test' });
const expect = require('chai').expect;
const mongoose = require('mongoose');
const User = require('../models/User');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);

function clearDB(done) {
  for (const i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(function() {});
  }
  return done();
};

before(function (done) {
  mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, function (err) {
    if (err) {
      throw err;
    }
    return clearDB(done);
  });
});

after(function (done) {
  mongoose.disconnect();
  return done();
});

describe('User', function() {

  it('creates a new user', function(done) {
    const user = new User({
      email: 'test1@gmail.com',
      password: 'test711',
      profile: {
        first_name: 'mohammad',
        last_name: 'mohammad',
        location: 'Los Angeles',
      },
    });
    user.save(function (err, saved) {
      if (err) return done(err);
      else {
        return done();
      }
    })
  });

  it('compare matching passwords', function(done) {
    const user = new User({
      email: 'test2@gmail.com',
      password: 'test711',
    });
    user.save(function (err, saved) {
      if (err) return done(err);
      else {
        saved.comparePassword('test711').then(isMatch => {
          expect(isMatch).to.be.true;
          return done();
        }).catch(err => done(err));
      }
    })
  })

  it('compare none matching passwords', function(done) {
    const user = new User({
      email: 'test3@gmail.com',
      password: 'test711',
    });
    user.save(function (err, saved) {
      if (err) return done(err);
      else {
        saved.comparePassword('test7s11').then(isMatch => {
          expect(isMatch).to.be.false;
          return done();
        }).catch(err => done(err));
      }
    })
  })

});