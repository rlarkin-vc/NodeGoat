var url = require('url');
var util = require('util');
var fs = require('fs');
var request = require('request');
var logger = require('logger');
var bl = require('bl');
var strftime = require('strftime');

var log = new logger.Logger();
log.info("hi\r\n");

request('http://www.google.com', function(err, resp, body) {
    console.log(body);      // CWEID 117
    log.debug(body);            // CWEID 117
});
request.get('http://www.google.com', function(err, resp, body) {
    console.log(body);      // CWEID 117
    log.info(body);         // CWEID 117
});
request.post('http://www.google.com', function(err, resp, body) {
    console.log(body);      // CWEID 117

    console.log(strftime('haha' + body.substring(0, 10)));      // CWEID 117
    var strftimeCEST = strftime.timezone(120);
    console.log(strftimeCEST('haha2' + body.substring(0, 10)));      // CWEID 117
    var utc = strftime.utc();
    console.log(utc('haha3' + body.substring(0, 10)));      // CWEID 117

    log.error(body);        // CWEID 117
    var b = new bl();
    b.append("XXX");
    b.append(body);
    b.append("YYY");
    console.log(b.toString()); // CWEID 117

    var c = new bl();
    c.append("ZZZ");
    var buf = new Buffer(50);   // CWEID 665
    b.copy(buf, 0, 0, 65);
    c.append(buf);
    c.append("ZZZX");
    console.log(c.toString());     // CWEID 117

    var d = b.duplicate();
    console.log(d.toString());      // CWEID 117
});
request.get('http://www.google.com', function(err, resp, body) {
    console.log(body);      // CWEID 117
    log.warn(body);         // CWEID 117
}).auth('username', 'pw', false);       // CWEID 259

request.get('https://wiki.veracode.local/', function(err, resp, body) {
    if(err) {
        console.log('wiki error:' + util.inspect(err));
    } else {
        console.log(body);          // CWEID 117
    }
});
request.get({url: 'https://wiki.veracode.local/', strictSSL: false}, function(err, resp, body) {        // CWEID 295
    if(err) {
        console.log('wiki2 error:' + util.inspect(err));
    } else {
        console.log(body);          // CWEID 117
    }
});
