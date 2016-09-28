const jwt = require('jsonwebtoken')
const CONFIG  = require('../config.js')

exports.auth = function(req, res, next) {
    const token = (req.cookies && req.cookies.token) || req.headers['Authorization'];

    // decode token
    if (token) {
        jwt.verify(token, CONFIG.secret, function(err, decoded) { // https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens 
            if (err) {
                next({ code: 401, message: "Failed to authenticate with a token" });
            } else {
                req.users_id = decoded;    
                next();
            }
        });
    }
    else {
        next({ code: 403, message: "No token provided" });
    }
};