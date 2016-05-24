var validator = require('validator');
var User = require('../model/user');


module.exports = function(req, res, next) {

  console.log('req.body', req.body);

  var username = validator.trim(req.body.username || '');
  var password = validator.trim(req.body.password || '');

  if (!username) {
    res.error('username', 'Required.', 'required');
  } else {
    if (!validator.isAlphanumeric(username)) {
      res.error('username', 'Letters and digits only please.', 'alphanumeric');
    }
    if (!validator.isLength(username, 3, 20)) {
      res.error('username', 'Must be 3 to 20 characters length.', 'length');
    }
  }
  if (!password) {
    res.error('password', 'Required.', 'required');
  } else {
    if (!validator.isLength(password, 3, 20)) {
      res.error('password', 'Must be 3 to 20 characters length.', 'length');
    }
  }

  req.valid()
  .then(function() {
    return User.findOne({username: username});
  })
  .then(function(user) {
    if (user) {
      res.error('username', 'This name is already taken.', 'unique');
    }
    return req.valid();
  })
  .then(function() {
    var user = new User({
      username: username,
      password: password
    });
    return user.save();
  })
  .then(function(user) {
    res.json({
      id: user._id,
      username: user.username
    });
  })
  .catch(next);
}
