const jwt = require('jsonwebtoken')
const DB  = require('../db.js')
const CONFIG  = require('../config.js')

function errorHandling(err) {
    var code, msg;

    switch (err.code) {
        case '23505': // UNIQUE VIOLATION
            msg = 'Email address already taken. Use another one please.'
            code = 400
            break;

        case '23514': // CHECK VIOLATION
            msg = 'Check violation'
            code = 400
            break;

        default:
            msg = 'Something wrong happened. Please try again or report the problem to the team.'
            code = 500
        }
    return {code: code, message: msg}
}

exports.signup = function(req, res, next) { // TODO check email address format
    if (req.body && req.body.email && req.body.password) {
        DB.connection()
        .then( client => {
            client.query("select signup($1, $2)", [req.body.email, req.body.password], (err, result) => {
                client.close();
                if (err) {
                    console.log('[ERROR]')
                    console.log(err)
                    next(errorHandling(err));
                }
                else {
                    res.status(201).send();
                }
            });
        })
        .catch( err => {
            console.log(err)
            next({ code: 500, message: "Cannot talk to the DB right now, sorry dude" });
        });
    }
    else {
        next({ code: 400 });
    }
};

exports.login = function(req, res, next) {
    if (req.body && req.body.email && req.body.password) {
        DB.connection()
        .then( client => {
            client.query("select login($1, $2)", [req.body.email, req.body.password], (err, result) => {
                client.close();
                if (err) {
                    console.log('[ERROR]')
                    console.log(err)
                    next(errorHandling(err));
                }
                else {
                    if (result.rows[0] && result.rows[0].login != null) {
                         // https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
                        var token = jwt.sign(result.rows[0].login, CONFIG.secret, {});
                        res.cookie('token', token, { expires: new Date(Date.now() + 900000), secure: false, httpOnly: true/*, signed: true*/ }); // 15mins
                        res.append('Authorization', token);
                        res.status(204).send(); // Successfully logged in
                    }
                    else {
                        next({ code: 401, message: 'Wrong credentials' });
                    }
                }
            });
        })
        .catch( err => {
            console.log(err)
            next({ code: 500, message: "Cannot talk to the DB right now, sorry dude" });
        });
    }
    else {
        next({ code: 400 });
    }
};

exports.updateScore = function(req, res, next) {
    if (req.body && req.body.action) {
        var funct;
        if ("known" === req.body.action) {
            funct = "increment";
        }
        else if ("unknown" === req.body.action) {
            funct = "decrement";
        }
        else {
            next({ code: 400 });
            return;
        }
        DB.connection()
        .then( client => {
            client.query("select "+funct+"_score($1, $2)", [req.users_id, req.params.wordId], (err, result) => {
                client.close();
                if (err) {
                    console.log('[ERROR]')
                    console.log(err)
                    next(errorHandling(err));
                }
                else {
                    res.status(204).send();
                }
            });
        })
        .catch( err => {
            console.log(err)
            next({ code: 500, message: "Cannot talk to the DB right now, sorry dude" });
        });
    }
    else {
        next({ code: 400 });
    }
};
