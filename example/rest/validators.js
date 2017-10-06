const isEmpty = require('is-empty')
const isEmail = require('is-email')

const isNotEmpty = value => !isEmpty(value)
isNotEmpty.errorCode = 'empty'

isEmail.errorCode = 'email'

exports.isNotEmpty = isNotEmpty;
exports.isEmail = isEmail;