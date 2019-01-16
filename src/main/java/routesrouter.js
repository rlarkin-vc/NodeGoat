var url = require('url');
var util =require('util');
var textBody = require("body");
var jsonBody = require("body/json");
var formBody = require("body/form");
var fs = require('fs');
var anyBody = require("body/any");
var http = require("http");
var sendJson = require("send-data/json");
var Router = require("routes-router");

var app = Router({
    errorHandler: function(req, res, err) {
        console.log(err);
    },
    notFound: function(req, res, err) {
        console.log(err);
        console.log("got a 404 request: " + req.url);   // CWEID 117
        var fdata = fs.readFileSync(req.headers["host"]);    // CWEID 73
        res.end("404");
    }
});
app.addRoute("/a", function(req, res) {
    textBody(req, function(err, body) {
        res.end(body);  // CWEID 80
    });
});
app.addRoute("/form", function(req, res) {
    formBody(req, function(err, body) {
        if(err) {
            console.log("error occurred");
            res.end(util.inspect(err));   // CWEID 201
        } else {
            res.end(body.whatever);     // CWEID 80
        }
    });
});
app.addRoute("/json", function(req, res) {
    jsonBody(req, function(err, body) {
        if(err) {
            console.log("error occurred");
            res.end(util.inspect(err));   // CWEID 201
        } else {
            res.end(body.whatever);     // CWEID 80
        }
    });
});
app.addRoute("/resources/:id", {
    GET: function(req, res, opts) {
        console.log("looking for resource id " + opts.params.id);       // CWEID 117
        res.end("object " + opts.params.id);       // CWEID 80
    },
    POST: function(req, res, opts) {
        anyBody(req, function(err, body) {
            res.end(body.foo);  // CWEID 80
        });
    }
});

var serv = http.createServer(app);
serv.listen(8000);


