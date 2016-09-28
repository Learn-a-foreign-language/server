const DB  = require('../db.js')
const ERROR  = require('../utils/errorHandler.js')

exports.get = function(req, res, next) {
    DB.connection()
        .then( client => {
            var query, args;
            if (req.query && req.query.search) {
                query = "select * from search_words($1,$2)";
                args = [req.query.search, req.users_id];
            }
            else {
                query = "select * from get_words($1)";
                args = [req.users_id];
            }
            client.query(query, args, (err, result) => {
                client.close();
                if (err) {
                    console.log('[ERROR]')
                    console.log(err)
                    next( {code: 500} );
                }
                else {
                    if (result.rows) {
                        res.status(200).json({words: result.rows});
                    }
                    else {
                        next({ code: 500, message: 'No results, shit' });
                    }
                }
            });
        })
        .catch( err => {
            console.log(err)
            next({ code: 500, message: "Unknow error, sorry dude" });
        });
};

exports.create = function(req, res, next) {
    const args = [req.body.expression, req.body.meanings, req.users_id];

    if (req.body && args.reduce(((prev, curr) => prev && curr), true) && req.body.meanings.length > 0) {
        DB.connection()
            .then( client => {
                client.query("select add_word($1,$2,$3)", args, (err, result) => {
                    client.close();
                    if (err) {
                        console.log('[ERROR]')
                        console.log(err)
                        next(ERROR.errorHandler(err));
                    }
                    else {
                        if (result.rows[0] && result.rows[0].add_word != null) {
                            res.status(201).json({word_id: result.rows[0].add_word});
                        }
                        else {
                            next({ code: 500, message: 'Something wrong happened' });
                        }
                    }
                });
            })
            .catch( err => {
                console.log(err)
                next({ code: 500, message: "Unknow error, sorry dude" });
            });
    }
    else {
        next({ code: 400 });
    }
};

exports.update = function(req, res, next) {
    // TODO
};

exports.delete = function(req, res, next) {
    // TODO
};