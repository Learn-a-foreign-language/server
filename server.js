#!/bin/env node
// Imports
const express      = require('express');
const fs           = require('fs');
const path         = require('path');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser')

const CONFIG   = require('./src/config.js')
const SECURITY = require('./src/utils/security.js')

// CONFIG
const SERVER_IP   = process.env.OPENSHIFT_NODEJS_IP   || '0.0.0.0'
const SERVER_PORT = process.env.OPENSHIFT_NODEJS_PORT || 8082

// Controllers
const usersController        = require('./src/controllers/users.js')
const wordsController        = require('./src/controllers/words.js')

function terminator(sig) {
    if (typeof sig === "string") {
       console.log('%s: Received %s - terminating app ...',
                   Date(Date.now()), sig);
       process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
}
process.on('exit', function() { terminator(); });

// Removed 'SIGPIPE' from the list - bugz 852598.
['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
].forEach(function(element, index, array) {
    process.on(element, function() { terminator(element); });
});

const app = express()
app.use(bodyParser.json()) // for parsing application/json
app.use(cookieParser())

// TO ALLOW CROSS DOMAIN REQUESTS
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

/* API */
// PUBLIC
app.post('/users', usersController.signup); // SIGNUP
app.post('/users/login', usersController.login); // LOGIN
// LOGGED IN USER
app.get('/words', SECURITY.auth, wordsController.get); // The list of words, sorted by worst scores // or /words?search=<word>&language=<lang>
app.post('/words', SECURITY.auth, wordsController.create);
app.put('/words/:id', SECURITY.auth, wordsController.update);
app.put('/words/:id', SECURITY.auth, wordsController.delete);
app.put('/me/scores/:wordId', SECURITY.auth, usersController.updateScore);

/* FRONT END */
app.use(express.static(__dirname + '/frontend/public'))
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'frontend', 'public', 'index.html'))
})

/*** In case of failure ***/
app.use(function(err, req, res, next) {
    // Some logging
    console.log("ERROR")
    console.log(err)
    //console.log(req)

    // Send the response to client
    const ret = res.status(err.code)
    if (err.message) {
      ret.json({error: err.message})
    }
    else {
      ret.send()
    }
});

// LETS GOOOO
const server = app.listen(SERVER_PORT, SERVER_IP, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log('%s: Node server version %s started on %s:%d ...',
        Date(Date.now()),
        process.versions.node,
        host,
        port
    );
});