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
var pg = require('pg');
var pgn = require('pg').native;

pg.defaults.password = 'password';      // CWEID 259

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
    var connstr = 'postgres://brandonadmin:password@localhost/testdb';
    pg.connect(connstr, function(err, client, done) {    // CWEID 259
        if(err) {
            throw err;
        }
        client.query('SELECT * FROM tbltest', function(err, result) {
            console.log(result);
            res.end(result.rows[0].b);      // CWEID 80
        });
    });
});
app.addRoute('/b/:id', function(req, res, opts) {
    pg.connect({
        user: "brandonadmin",
        host: "localhost",
        database: "testdb",
        password: "password",    // CWEID 259
    }, function(err, client, done) {
        if(err) {
            throw err;
        }
        client.query('SELECT * FROM tbltest', function(err, result) {
            console.log(result);
            res.end(result.rows[0].b);      // CWEID 80
        });
    });
});
app.addRoute('/c/:id', function(req, res, opts) {
    pg.connect({
        user: "brandonadmin",
        host: "localhost",
        database: "testdb",
        password: "password",    // CWEID 259
    }, function(err, client, done) {
        if(err) {
            throw err;
        }
        client.query('SELECT * FROM tbltest WHERE a = ' + opts.params.id, function(err, result) {   // CWEID 89
            console.log(result);
            res.end(result.rows[0].b);      // CWEID 80
        });
    });
});
app.addRoute('/d/:id', function(req, res, opts) {
    pg.connect({
        user: "brandonadmin",
        host: "localhost",
        database: "testdb",
        password: "password",    // CWEID 259
    }, function(err, client, done) {
        if(err) {
            throw err;
        }
        var q = client.query('SELECT * FROM tbltest WHERE a = ' + opts.params.id);  // CWEID 89
        q.on('row', function(row) {
            res.end(row.b);      // CWEID 80
        });
    });
});
app.addRoute('/e/:id', function(req, res, opts) {
    pg.connect({
        user: "brandonadmin",
        host: "localhost",
        database: "testdb",
        password: "password",    // CWEID 259
    }, function(err, client, done) {
        if(err) {
            throw err;
        }
        var q = client.query({
                text: 'SELECT * FROM tbltest WHERE a = ' + opts.params.id
        });  // CWEID 89
        q.on('row', function(row) {
            res.end(row.b);      // CWEID 80
        });
    });
});
app.addRoute('/f/:id', function(req, res, opts) {
    pg.connect({
        user: "brandonadmin",
        host: "localhost",
        database: "testdb",
        password: "password",    // CWEID 259
    }, function(err, client, done) {
        if(err) {
            throw err;
        }
        var q = client.query({
                text: 'SELECT * FROM tbltest WHERE a = $1',
                values: [opts.params.id]
        });
        q.on('row', function(row) {
            res.end(row.b);      // CWEID 80
        });
    });
});
app.addRoute('/g/:id', function(req, res, opts) {
    pgn.connect({
        user: "brandonadmin",
        host: "localhost",
        database: "testdb",
        password: "password",    // CWEID 259
    }, function(err, client, done) {
        if(err) {
            throw err;
        }
        var q = client.query({
                text: 'SELECT * FROM tbltest WHERE a = $1',
                values: [opts.params.id]
        });
        q.on('row', function(row) {
            res.end(row.b);      // CWEID 80
        });
    });
});


var serv = http.createServer(app);
serv.listen(8000);
