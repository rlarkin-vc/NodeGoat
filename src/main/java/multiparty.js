var url = require('url');
var util = require('util');
var fs = require('fs');
var http = require("http");
var Router = require("routes-router");
var multiparty = require('multiparty');


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
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        res.write("testing:\r\n");
        console.log(util.inspect(fields));
        console.log(util.inspect(files));
        console.log(util.inspect(files.image[0].headers));
        res.write(fields.foo[0]);          // CWEID 80
        res.end('x');
    });
});
app.addRoute('/b/:id', function(req, res, opts) {
    var form = new multiparty.Form();
    form.on('part', function(part) {
        console.log('part: ' + util.inspect(part));     //CWEID 117
        res.write(part.name);       // CWEID 80
        res.write('haha');
    });
    form.parse(req, function(err, fields, files) {
        res.write("testing:\r\n");
        console.log(util.inspect(fields));
        console.log(util.inspect(files));
        console.log(util.inspect(files.image[0].headers));
        res.write(fields.foo[0]);          // CWEID 80
        res.end('x');
    });
});


var serv = http.createServer(app);
serv.listen(8000);
