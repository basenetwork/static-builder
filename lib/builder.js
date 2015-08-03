var fs =  require("fs");
var jsx = require(__dirname + '/../src/react-0.13.3/build/JSXTransformer.js');

var MIME = {
    ".js":   "text/javascript",
    ".css":  "text/css",
    ".html": "text/html",
    ".txt":  "text/plain",
    ".gif":  "image/gif",
    ".png":  "image/png",
    ".eot":  "application/x-font-eot",
    ".ttf":  "application/x-font-ttf",
    ".svg":  "application/x-font-svg",
    ".woff": "application/x-font-woff",
    ".woff2": "application/x-font-woff2",
    ".iso":   "application/octet-stream"
};
var _dataDir = __dirname + '/../../base.server-node/data/';
var stdDir = __dirname + '/../src/';

var _REGISTRARS_ = JSON.stringify(JSON.parse(fs.readFileSync(_dataDir+'registrars.json').toString()));
var _MIME_TYPES_ = JSON.stringify(JSON.parse(fs.readFileSync(_dataDir+'mime_types.json').toString()));
var _INIT_NODES_ = JSON.stringify(fs.readFileSync(_dataDir+'nodes.dat').toString().split("\n").map(function(node){
    return JSON.parse(node).nid;
}));

function compile(filename, cssAsJS) {
    if(!fs.existsSync(filename))
        return console.error("Compile error: File does not exists!", filename);
    var dir = require('path').dirname(filename) + '/';
    var ext = filename.match(/\.[a-z]+$/)[0];
    var cont = fs.readFileSync(filename).toString();
    var isJS = ext === '.js' || ext === '.jsx';

    if(isJS) {
        cont = cont.replace('[/*__REGISTRARS__*/]', _REGISTRARS_);
        cont = cont.replace('[/*__INIT_NODES__*/]', _INIT_NODES_);
        cont = cont.replace('{/*__MIME_TYPES__*/}', _MIME_TYPES_);
    }
    if(ext === '.jsx') try { // compile react-js
        cont = jsx.transform(cont).code;
    } catch(e) {}
    if(ext === '.css') {// compile css
        cont = cont.replace(/\burl\(['"]?([^\(\)'":]*)['"]?\)/g, function (_, url) {
            url = url.split(/[\?#]/)[0];
            var ext = url.match(/\.[a-z0-9]+$/)[0];
            var src64 = fs.readFileSync(dir + url).toString("base64");
            return "url(data:" + (MIME[ext] || MIME[".iso"]) + ";charset=utf-8;base64," + src64 + ")";
        });
    }
    cont = cont.split("\n").map(function(line) {
        if (/^\s*\/\*.*?\*\/\s*$/.test(line)) return "";
        var incl = (line.match(/^\s*\/\/\s*include\s*(\S+)\s*$/) || line.match(/^@import\s*"(\S+)";\s*$/) || {})[1];
        if (incl) {
            if(fs.existsSync(stdDir + incl)) return compile(stdDir + incl, isJS);
            return compile(dir + incl, isJS);
        }
        return line;
    }).join("\n");

    if(ext === '.css' && cssAsJS) { // include css as js
        cont = '(function(p,e,c){' +
            'e.type="text/css";' +
            'e.innerHTML=c;' +
            'p.appendChild(e);' +
        '})(document.head,document.createElement("style"),'+JSON.stringify(cont)+');\n';
    }
    return cont;
}

module.exports = {
    compile: function(filename){
        return compile(filename)
    }
};