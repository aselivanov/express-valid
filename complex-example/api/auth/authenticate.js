const jwt = require('jsonwebtoken');
const config = require('../config');

const AUHTORIZATION_RE = 'Bearer (\S+)';

module.export = (req, res, next) => {
    try {
        req.userId = jwt.verify(req.get('authorization').split(' ')[1], config.secret);
    } catch(e) {}    
}