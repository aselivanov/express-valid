var path = require('path');
var nconf = require('nconf');

module.exports = nconf
    .file('local', path.resolve(__dirname, 'local.json'))
    .file('defaults', path.resolve(__dirname, 'defaults.json'))
    .get();