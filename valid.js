var dot = require('dot-object');


module.exports = function valid(options) {

  if (!options || !options.otherwise) {
    throw new Error('`otherwise` validation failure handler is missing.');
  }

  return function (req, res, next) {

    var errors = {};

    res.error = function error(prop, message, code) {
      var list = errors[prop] = errors[prop] || [];
      list.push({
        message: message,
        code: code
      });
    };

    res.nonFieldError = function nonFieldError(message, code) {
      return res.error(null, message, code);
    }

    req.valid = function valid() {
      if (Object.keys(errors).length === 0) {
        return Promise.resolve();
      } else {
        dot.object(errors);
        options.otherwise(req, req.res, errors);
        return new Promise(function() {}); // always pending
      }
    }

    next();
  };
};
