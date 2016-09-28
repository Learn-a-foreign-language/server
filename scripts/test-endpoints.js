#!/usr/bin/env node 

var ex = require('child_process');
var base_url = "https://learnenglishbackend-romainpellerin.rhcloud.com";
//var base_url = "http://127.0.0.1:8082";

function get(url, verbose) {
    var verbose_arg = '';
    if (verbose)
        verbose_arg = '-i -v'; // -v
    console.log("Testing GET with\t"+url);
    var cmd = 'curl '+verbose_arg+' -b /tmp/curl_cookies.txt -c /tmp/curl_cookies.txt -s'+
     ' -H "Content-Type: application/json"'+
     ' -X GET "'+base_url+url+'"';
     
     var raw_json = ex.execSync(cmd).toString();

     try {
        console.log(JSON.stringify(JSON.parse(raw_json),null,"\t"));
     }
     catch(e) {
        console.log(raw_json);
     }
     return raw_json;
}

function post(url, data, verbose) {
    var verbose_arg = '';
    if (verbose)
        verbose_arg = '-i'; // -v
    console.log("Testing POST with\t"+url);
    var cmd = 'curl '+verbose_arg+' -b /tmp/curl_cookies.txt -c /tmp/curl_cookies.txt -s'+
     ' -H "Content-Type: application/json"'+
     ' -d \'' + JSON.stringify(data) + '\'' +
     ' -X POST "'+base_url+url+'"';
     console.log(cmd);
     var raw_json = ex.execSync(cmd).toString();

     try {
        console.log(JSON.stringify(JSON.parse(raw_json),null,"\t"));
     }
     catch(e) {
        console.log(raw_json);
     }
     return raw_json;
}

function put(url, data, verbose) {
    var verbose_arg = '';
    if (verbose)
        verbose_arg = '-i'; // -v
    console.log("Testing PUT with\t"+url);
    var cmd = 'curl '+verbose_arg+' -b /tmp/curl_cookies.txt -c /tmp/curl_cookies.txt -s'+
     ' -H "Content-Type: application/json"'+
     ' -d \'' + JSON.stringify(data) + '\'' +
     ' -X PUT "'+base_url+url+'"';
     console.log(cmd);
     var raw_json = ex.execSync(cmd).toString();

     try {
        console.log(JSON.stringify(JSON.parse(raw_json),null,"\t"));
     }
     catch(e) {
        console.log(raw_json);
     }
     return raw_json;
}

console.log("====================================================================================================");
console.log("====================================================================================================");

if (process.argv[2]) {
    if (process.argv[3])
        eval(process.argv[2])(process.argv[3]);
    else
        get(process.argv[2]);
    return;
}

var email = "test";
var pwd   = "test";

//post('/users', {email: email, password: pwd}, false);
//post('/users', {email: email, passwordd: pwd}, false);
post('/users/login', {email: email, password: pwd}, false);
get('/words', false);
get('/words?search=elL', false);
// post('/words', {expression: 'hello lol okkk hahdad',
//                 language: 'en',
//                 examples: ['uo','okkkk'],
//                 further_details: ['det','ails'],
//                 added_by: 'f62f867e-2abc-4687-b52f-409f7996b4e5'},
//                 false);
put('/me/scores/0245ba5f-c02f-490a-976a-c9b84cfcc6ba', {action: "unknown"}, true);