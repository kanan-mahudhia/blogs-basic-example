const jwt = require('jsonwebtoken');
const config = require('config');
const secret = config.get('auth.jwt.secret');

class DecodeService {
    constructor() {
    }

    decodeToken(req, res) {
        if (req.headers && req.headers.authorization) {
            var authorization = req.headers.authorization.split(' ')[1], decoded;
            decoded = jwt.verify(authorization, secret);
            return decoded;
        } 
        else {
            return new Error('Unauthorized');
        }
    }
}

module.exports = DecodeService;
