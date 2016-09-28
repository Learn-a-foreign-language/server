// TODO delete this file, change the error handling system

exports.errorHandler = function (err) {
    var code, msg;

    switch (err.code) {
        case '23505': // UNIQUE VIOLATION
            msg = 'Unique violation.'
            code = 400
            break;

        case '23514': // CHECK VIOLATION

        default:
            msg = 'Something wrong happened. Please try again or report the problem to the team.'
            code = 500
        }
    return {code: code, message: msg}
}