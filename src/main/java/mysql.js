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
var mysql = require('mysql');

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
app.addRoute("/a/:id", function(req, res, opts) {
    var conn = mysql.createConnection({
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
    });
    conn.connect();
    if(opts.params.id != "foo") {
        conn.query("SELECT b FROM tbltest WHERE a = " + opts.params.id, function(err, rows) {       // CWEID 89
            console.log(rows);
            res.end(rows[0].b);     // CWEID 80
        });
    } else {
        res.end("x");
    }
});

app.addRoute('/pool/:id', function(req, res, opts) {
    var pool = mysql.createPool({
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
    });
    if(opts.params.id != "foo") {
        pool.query("SELECT b FROM tbltest WHERE a = " + opts.params.id, function(err, rows, fields) {       // CWEID 89
            console.log(rows);
            console.log('fields:' + util.inspect(fields));
            res.end(rows[0].b);     // CWEID 80
        });
    } else {
        res.end("x");
    }
});

app.addRoute('/pool2/:id', function(req, res, opts) {
    var pool = mysql.createPool({   // CWEID 295
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
        ssl: {
            rejectUnauthorized: false
        }
    });
    if(opts.params.id != "foo") {
        pool.getConnection(function(err, c) {
            if(err) {
                res.end(util.inspect(err));         // CWEID 201
            } else {
                c.query("SELECT b FROM tbltest WHERE a = " + opts.params.id, function(err, rows) {       // CWEID 89
                    console.log(rows);
                    res.end(rows[0].b);     // CWEID 80
                });
            }
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/pool3/:id', function(req, res, opts) {
    var pool = mysql.createPool({
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
    });
    if(opts.params.id != "foo") {
        pool.query({                // CWEID 89
            sql: "SELECT b FROM tbltest WHERE a = " + opts.params.id
        }, function(err, rows, fields) {
            console.log(rows);
            console.log('fields:' + util.inspect(fields));
            res.end(rows[0].b);     // CWEID 80
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/pool4/:id', function(req, res, opts) {
    var pool = mysql.createPool({
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
    });
    if(opts.params.id != "foo") {
        pool.query({
            sql: "SELECT b FROM tbltest WHERE a = " + mysql.escape(opts.params.id)
        }, function(err, rows, fields) {
            console.log(rows);
            console.log('fields:' + util.inspect(fields));
            res.end(rows[0].b);     // CWEID 80
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/pool5/:id', function(req, res, opts) {
    var pool = mysql.createPool({
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
    });
    if(opts.params.id != "foo") {
        pool.query({
            sql: "SELECT b FROM tbltest WHERE a = " + pool.escapeId(opts.params.id)
        }, function(err, rows, fields) {
            console.log(rows);
            console.log('fields:' + util.inspect(fields));
            res.end(rows[0].b);     // CWEID 80
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/pool6/:id', function(req, res, opts) {
    var pool = mysql.createPool({
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
    });
    if(opts.params.id != "foo") {
        var stmt = mysql.format("SELECT b FROM tbltest WHERE a = " + opts.params.id, []);

        pool.query({     // CWEID 89
            sql:   stmt,
          }, function(err, rows, fields) {
            console.log(rows);
            console.log('fields:' + util.inspect(fields));
            res.end(rows[0].b);     // CWEID 80
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/pool7/:id', function(req, res, opts) {
    var pool = mysql.createPool({
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',       // CWEID 259
    });
    if(opts.params.id != "foo") {
        var stmt = mysql.format("SELECT b FROM tbltest WHERE a = " + opts.params.id, []);

        var q = pool.query({        // CWEID 89
            sql: stmt,
       });
        q.on('result', function(row) {
            console.log(row);   // CWEID 117
            res.end(row.b);     // CWEID 80
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/cluster/:id', function(req, res, opts) {
    var cfg = {
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',   // CWEID 259
    };
    var cfg2 = {
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',   // CWEID 259
        ssl: {
            rejectUnauthorized: false
        }
    };
    var cluster = mysql.createPoolCluster();
    cluster.add(cfg);
    cluster.add("another", cfg2);       // CWEID 295

    if(opts.params.id != "foo") {
        cluster.getConnection(function(err, conn) {
            conn.query("SELECT b FROM tbltest WHERE a = " + opts.params.id, function(err, rows, fields) {       // CWEID 89
                console.log(rows);
                console.log('fields:' + util.inspect(fields));
                res.end(rows[0].b);     // CWEID 80
            });
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/cluster2/:id', function(req, res, opts) {
    var cfg = {
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',   // CWEID 259
    };
    var cfg2 = {
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',   // CWEID 259
        ssl: {
            rejectUnauthorized: false
        }
    };
    var cluster = mysql.createPoolCluster();
    cluster.add(cfg);
    cluster.add("another", cfg2);       // CWEID 295

    if(opts.params.id != "foo") {
        cluster.getConnection(function(err, conn) {
            var q = {
                sql: "SELECT b FROM tbltest WHERE a = " + opts.params.id
            };
            conn.query(q, function(err, rows, fields) {       // CWEID 89
                console.log(rows);
                console.log('fields:' + util.inspect(fields));
                res.end(rows[0].b);     // CWEID 80
            });
        });
    } else {
        res.end("x");
    }
});
app.addRoute('/cluster3/:id', function(req, res, opts) {
    var cfg = {
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',   // CWEID 259
    };
    var cfg2 = {
        socketPath: '/opt/local/var/run/mysql56/mysqld.sock',
        database: 'root',
        user: 'root',
        password: 'password',   // CWEID 259
        ssl: {
            rejectUnauthorized: false
        }
    };
    var cluster = mysql.createPoolCluster();
    cluster.add(cfg);
    cluster.add("another", cfg2);       // CWEID 295

    if(opts.params.id != "foo") {
        cluster.getConnection(function(err, conn) {
            conn.beginTransaction(function(err) {
                if(err) {
                    throw(err);
                }
                conn.query("SELECT b FROM tbltest WHERE a = " + opts.params.id, function(err, rows, fields) {       // CWEID 89
                    console.log(rows);
                    console.log('fields:' + util.inspect(fields));
                    res.end(rows[0].b);     // CWEID 80
                });
                conn.commit(function(err) {});
            });
        });
    } else {
        res.end("x");
    }
});

var serv = http.createServer(app);
serv.listen(8000);
