const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser (user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function (req, res, next) {
  res.send({ token: tokenForUser(req.user) });
};

exports.signup = function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'Please provide email and password' });
  }

  // check if user already exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    // If user exists, return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If not, create a new record and save to DB
    const user = new User({
      email: email,
      password: password
    });

    user.save(function (err) {
      if (err) {
        return next(err);
      }

      // Respond to request
      res.json({ token: tokenForUser(user) });
    });
  });
};