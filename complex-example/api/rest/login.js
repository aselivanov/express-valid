const validator = require('validator');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../model/User');

module.exports = (req, res, next) => {
    let email = validator.trim(req.body.email || '')
    let password = validator.trim(req.body.password || '');

    if (!email) {
        req.errorCode('email', 'empty');
    }
    if (!password) {
        req.errorCode('password', 'empty');
    }
    req.valid()
        .then(() => User.findOne({ email, password }))
        .then((user) => {
            if (!user) {
                req.errorCode('all', 'invalid');
            }
            return req.valid(user);
        })
        .then((user) => {
            const token = jwt.sign(user._id, config.secret);
            res.status(200).send(token);
        })
        .catch(next);
}