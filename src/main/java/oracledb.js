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
var oracledb = require('oracledb');

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
    oracledb.getConnection({
        user: "system",
        password: "3fgYfdzbCuQC",       //CWEID 259
        connectString: "127.0.0.1/XE",
    }, function(err, conn) {
        if(err) {
            throw err;
        }
        conn.execute('SELECT * FROM tbltest', function(err, result) {
            console.log(result);
            res.end(result.rows[0][1]);    // CWEID 80
        });
    });
});
app.addRoute('/b/:id', function(req, res, opts) {
    oracledb.getConnection({
        user: "system",
        password: "3fgYfdzbCuQC",        // CWEID 259
        connectString: "127.0.0.1/XE",
    }, function(err, conn) {
        if(err) {
            throw err;
        }
        conn.execute('SELECT * FROM tbltest WHERE a = ' + opts.params.id, [], {     // CWEID 89
            outFormat: oracledb.OBJECT
        }, function(err, result) {
            console.log(result);
            res.end(result.rows[0].B);    // CWEID 80
        });
    });
});
app.addRoute('/c/:id', function(req, res, opts) {
    oracledb.getConnection({
        user: "system",
        password: "3fgYfdzbCuQC",        // CWEID 259
        connectString: "127.0.0.1/XE",
    }, function(err, conn) {
        if(err) {
            throw err;
        }
        conn.execute('SELECT * FROM tbltest WHERE a = :did', [opts.params.id], {
            outFormat: oracledb.OBJECT
        }, function(err, result) {
            console.log(result);
            res.end(result.rows[0].B);    // CWEID 80
        });
    });
});

app.addRoute('/d/:id', function(req, res, opts) {
    oracledb.createPool({
        user: "system",
        password: "3fgYfdzbCuQC",        // CWEID 259
        connectString: "127.0.0.1/XE",
    }, function(err, pool) {
        pool.getConnection(function(err, conn) {
            if(err) {
                throw err;
            }
            conn.execute('SELECT * FROM tbltest WHERE a = ' + opts.params.id, [], {     // CWEID 89
                outFormat: oracledb.OBJECT
            }, function(err, result) {
                if(err) {
                    res.end(err.stack);     // CWEID 117
                } else {
                    console.log(result);
                    res.end(result.rows[0].B);    // CWEID 80
                }
            });
            pool.terminate(function(err) {
                if(err) {
                    throw err;
                }
            });
        });
    });
});


var serv = http.createServer(app);
serv.listen(8000);
