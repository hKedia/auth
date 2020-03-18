const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
const localOptions = {
  usernameField: 'email'
};
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  // verify the email and passport
  // call done with user if correct email, password
  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      done(null, false);
    }

    // compare passwords from DB
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
});

// Setup options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // see if user id in payload exists in db
  // if yes, call done with the user, otherwise call done without user
  User.findById(payload.sub, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// tell passport to use above strategy
passport.use(jwtLogin);
passport.use(localLogin);