const validator = require('validator')
const User = require('../model/User')

module.exports = (req, res, next) => {
    let email = validator.trim(req.body.email || '')
    let password = validator.trim(req.body.password || '')

    if (!email) {
        req.errorCode('email', 'empty')
    } else if (!validator.isEmail(email)) {
        req.errorCode('email', 'invalid')
    }
    if (!password) {
        req.errorCode('password', 'empty')
    } else if (!validator.isLength(password, 3, 20)) {
        req.errorCode('password', 'outOfRange')
    }

    req.valid()
        .then(() => User.findOne({ email }))
        .then((user) => {
            if (user) {
                req.errorCode('email', 'taken')
            }
            return req.valid()
        })

        .then(() => User.create({ email, password }))
        
        .then((user) => {
            res.json({
                id: user._id,
                username: user.username
            })
        })
        .catch(next)
}
