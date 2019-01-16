var url = require('url');
var util = require('util');
var fs = require('fs');
var http = require("http");
var HttpHashRouter = require('http-hash-router');
var multiparty = require('multiparty');

var router = HttpHashRouter();

router.set('/a/:id', function(req, res, opts) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        res.write("testing:\r\n");
        console.log(util.inspect(fields));
        console.log(util.inspect(files));
        console.log(util.inspect(files.image[0].headers));
        console.log(opts.params);       // CWEID 80
        res.write("opt: " + opts.params.id);    //CWEID 80
        res.write(fields.foo[0]);          // CWEID 80
        res.end('x');
    });
});

var serv = http.createServer(function handler(req, res) {
    router(req, res, {}, function(err) {
        res.write('error:\r\n');
        res.end(err.stack);         // CWEID 201
    });
});
serv.listen(8000);
