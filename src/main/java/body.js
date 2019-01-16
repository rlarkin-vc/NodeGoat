var url = require('url');
var util =require('util');
var textBody = require("body");
var jsonBody = require("body/json");
var formBody = require("body/form");
var anyBody = require("body/any");
var http = require("http");
var sendJson = require("send-data/json");

var serv = http.createServer(function handleRequest(req, res) {
    function send(err, body) {
        console.log('send: ' + body);    // CWEID 117
        sendJson(req, res, body);
    }

    function send2(err, body) {
        console.log("send2: " + body);   // CWEID 117
        res.end(body);                   // CWEID 80
    }

    if (req.url === "/body") {
        textBody(req, send2);
    } else if (req.url === "/form") {
        formBody(req, {}, send);
    } else if (req.url === "/form2") {
        formBody(req, {}, function(err, body) {
            console.log("form2: " + body.whatever);     // CWEID 117
            res.end(body.whatever);         // CWEID 80
        });
    } else if (req.url === "/json") {
        jsonBody(req, res, send);
    } else if (req.url === "/any") {
        anyBody(req, res, {}, send);
    } else {
        res.end("nada");
    }
});
serv.listen(8000);
