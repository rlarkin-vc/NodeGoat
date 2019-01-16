var url = require('url');
var util = require('util');
var fs = require('fs');
var http = require("http");
var Router = require("routes-router");
var busboy = require('busboy');


var app = Router({
    errorHandler: function(req, res, err) {
        console.log(err);
        res.end("500");
    },
    notFound: function(req, res, err) {
        console.log(err);
        console.log("got a 404 request: " + req.url);   // CWEID 117
        res.end("404");
    }
});

app.addRoute('/a/:id', function(req, res, opts) {
    var bb = new busboy({ headers: req.headers });
    bb.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('args:' + this.arguments);
        file.on('data', function(data) {
            console.log('file.data');
            if(data) {
                res.write(data.toString().substring(5000));            // CWEID 80
            }
        });
        file.on('end', function() {
            console.log('file.end');
        });
    });
    bb.on('field', function(fieldname, val, nameTruncated, valTruncated) {
        console.log('bb.field');
        res.write("fieldname: " + fieldname + "\n");        // CWEID 80
        res.write("val: " + val + "\n");        // CWEID 80
        res.write("nameTruncated: " + nameTruncated + "\n");
        res.write("valTruncated: " + valTruncated + "\n");
    });
    bb.on('finish', function() {
        res.end('done');
    });
    req.pipe(bb);
});


var serv = http.createServer(app);
serv.listen(8000);
