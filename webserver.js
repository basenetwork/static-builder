#!/usr/bin/env node

var http    = require("http");
var builder = require("./lib/builder.js");

var locations = {
    "/client.js":   __dirname + "/../client-js/lib/core.js",
    "/core.js":     __dirname + "/../site-engine-js/app-core/main.js",
    "/engine.js":   __dirname + "/../site-engine-js/app-std/main.js"
};

http.createServer(function(req, res) {
    var path = locations[req.url];
    if(path) {
        res.writeHead(200, {'Content-Type': "text/javascript; charset=UTF-8"});
        res.end(builder.compile(path));
    } else {
        res.writeHead(404, {'Content-Type': "text/html"});
        res.end("404 - Not found");
    }

}).listen(
    (process.argv[2]|0) || 80,
    process.argv[3] || "localhost"
);
