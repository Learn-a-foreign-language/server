#!/usr/bin/env node 

'use strict';

const request = require('request').defaults({jar: true})
const ex      = require('child_process')
const fs      = require('fs')

function post(url, data, callback) {
    console.log('Posting...')
    request({
        url: url,
        method: "POST",
        json: data
    },
    function optionalCallback(error, httpResponse, body) {
      if (error || (httpResponse.statusCode !== 201 && httpResponse.statusCode !== 204 && body.error !== 'Unique violation.')) {
        console.error('POST failed for:', JSON.stringify(data,null,'\t'));
        callback && callback({error, httpResponse, body})
      }
      //console.log('Upload successful!  Server responded with:', body);
      callback && callback(null, {httpResponse, body})
    });
}



function postMultiple(array) {
    return new Promise((resolve, reject) => {
        if (array.length === 0) {
            resolve();
        }
        else {
            let promises = [];
            var index = 0;
            for (let item of array) {
                index++;
                var prom = new Promise((resolve, reject) => {
                    let _index = index;
                    post('https://learnenglishbackend-romainpellerin.rhcloud.com/words', item, (error, response) => {
                        console.log("Processed "+_index+" out of "+array.length)
                        if (error) {
                            console.error('[Request n°'+_index+']',error.error?error.error:error.httpResponse.statusCode, error.body?error.body:'');
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                });
                promises.push(prom);
            }
            Promise.all(promises).then(resolve).catch(reject);
        }
    });
};

function iterateOver(arrayToUpload, number, callback) {
    var toProcess = arrayToUpload.splice(0, number);
    postMultiple(toProcess)
        .then(success => {
            callback();
        })
        .catch(errorArray => {
            console.log('ERROR with something within this current batch.')
            process.exit();
        });
}


var main = function(error,data) {
    var data = fs.readFileSync(__dirname+'/vocabulary.txt', {encoding: 'utf-8'}, function (err) {
        if (err) {
            console.log(err);
            process.exit();
        }
    });

    var array = data.split('\n');
    array = array.map(line => {
        var tmp = line.split('=').map(side => side.trim());
        //console.log(tmp[0])
        //console.log(tmp[1])
        return {
            expression: tmp[0],
            meanings: (tmp[1]).split("//")
        }
    });
    
    // TODO 
    // - split meaning side with '//'
    // - upload in a random order
    // - the script ask for email and password or can be provided as arguments

    var numberPerBatch = 5;
    var total = array.length;

    iterateOver(array, numberPerBatch, function end() {
        if (array.length !== 0) {
            console.log("Remaining "+array.length+"...")
            iterateOver(array, numberPerBatch, end)
        }
        else
            console.log("Processed "+total+" items")
    })
}

post('https://learnenglishbackend-romainpellerin.rhcloud.com/users/login', {email: "", password: ""}, main);