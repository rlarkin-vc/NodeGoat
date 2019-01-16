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
var mongodb = require('mongodb');
var mongoclient = mongodb.MongoClient;

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
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var adm = db.admin();
        adm.listDatabases(function(err, dbs) {
            console.log(dbs);       //CWEID 312
        });
        var obj = {};
        obj[opts.params.id] = 1;
        adm.command(obj, function(err, info) {      // CWEID 943
            res.end(info.sysInfo);  // CWEID 201
        });
    });
});

app.addRoute('/b/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var adm = db.admin();
        adm.serverInfo(function(err, info) {
            console.log(info);      //CWEID 312
            res.end(JSON.stringify(info));  // CWEID 201
        });
    });
});
app.addRoute('/c/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var adm = db.admin();
        adm.serverInfo(function(err, info) {
            console.log(info);      //CWEID 312
            res.end(info.sysInfo);  // CWEID 201
        });
    });
});
app.addRoute('/d/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var adm = db.admin();
        adm.serverStatus(function(err, info) {
            console.log(info);      //CWEID 312
            res.end(JSON.stringify(info));  // CWEID 201
        });
    });
});
app.addRoute('/e/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        coll.aggregate([
        ], function(err, result) {
            if(err) {
                console.log("error durring aggregation: " + err.stack);
                res.end("error for id: " + opts.params.id);        // CWEID 80
            } else {
                console.log("result: " + util.inspect(result));
                res.end(result[0].b);       // CWEID 80
            }

        });
    });
});
app.addRoute('/f/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        var agg = coll.aggregate([]);
        agg.next(function(err, result) {
            if(err) {
                console.log("error durring aggregation: " + err.stack);
                res.end("error for id: " + opts.params.id);        // CWEID 80
            } else {
                console.log("result: " + util.inspect(result));
                res.end(result.b);       // CWEID 80
            }

        });
    });
});
app.addRoute('/g/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        anyBody(req, function(err, body) {
            if(body.idx) {
                console.log("body.idx: " + body.idx);   // CWEID 117
                coll.createIndex(body.idx, function(err, idxres) {  // CWEID 943
                    if(err) {
                        res.end(err.stack); // CWEID 201
                    } else {
                        res.end(JSON.stringify(idxres));    // CWEID 201
                    }
                });
            } else {
                res.end(body.foo);      // CWEID 80
            }
        });
    });
});
app.addRoute('/h/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.deleteMany({ a: body.filt}, function(err, result) {            // safe!  the entire filter isn't specified, just a single value
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    }
                    console.log(result);
                    res.end("deleted");
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/hh/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.deleteMany(body.filt, function(err, result) {      // CWEID 943
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    }
                    console.log(result);
                    res.end("deleted");
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/i/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.deleteOne(body.filt, function(err, result) {      // CWEID 943
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    }
                    console.log(result);
                    res.end("deleted");
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/ii/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.deleteOne({ a: body.filt}, function(err, result) {      // safe
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    }
                    console.log(result);
                    res.end("deleted");
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/j/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.find(body.filt).toArray(function(err, result) {        // CWEID 943
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    } else {
                        console.log(result);
                        res.end(result[0].b);   // CWEID 80
                    }
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/k/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.findAndRemove(body.filt, [], function(err, result) {       // CWEID 943
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    } else {
                        console.log(result);   
                        res.end(result.value.b);    // CWEID 80
                    }
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/l/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.insertOne(body.filt, function(err, result) {       // CWEID 943
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    } else {
                        console.log(result);   
                        res.end('inserted');   
                    }
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/ll/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                coll.insertOne({ a: body.filt, b: "bar"}, function(err, result) {       // safe
                    if(err) {
                        res.end(err.stack);     // CWEID 201
                    } else {
                        console.log(result);   
                        res.end('inserted');    
                    }
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/m/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.filt) {
                console.log("filter: " + util.inspect(body.filt));
                var cursor = coll.find(body.filt);      // CWEID 943
                cursor.forEach(function(result) {
                        console.log(result);
                        res.end(result.b);          // CWEID 80
                    }, function(err) {
                        if(err) {
                            res.end(err.stack);     // CWEID 201
                        }
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});
app.addRoute('/n/:id', function(req, res, opts) {
    mongoclient.connect('mongodb://localhost/test', function(err, db) {
        var coll = db.collection("testcoll");
        jsonBody(req, function(err, body) {
            if(err) {
                res.end(err.stack); // CWEID 201
                return;
            }
            console.log(body);      //CWEID 117
            if(body && body.ev) {
                console.log("ev: " + util.inspect(body.ev));
                db.eval(body.ev, [], function(err, result) {        // CWEID 95
                        if(err) {
                            res.end(err.stack);     // CWEID 201
                        } else {
                            console.log(result);        //CWEID 312
                            res.end(util.inspect(result));  // CWEID 201
                        }
                });
            } else {
                res.end(body.foo);  // CWEID 80
            }
        });
    });
});


var serv = http.createServer(app);
serv.listen(8000);
