var request = require('request');
var util = require('util');
var http = require('http');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var app = http.createServer(handler);
app.listen(8080);
console.log('Mistral Active...');

function handler (req, res) {
    console.log('request starting...');
	var indexPath = "./html/index.html";
    var filePath = '.' + req.url;
    if (req.method !== 'GET') {
		res.writeHead(400);
		res.end();
		return;
	}
    if (filePath == './' || filePath == './server.js') {
        filePath = indexPath;
    }
    console.log(filePath);
    var s = fs.createReadStream(filePath);
    s.on('error', function () {
      console.log("ERROR!");
      console.log(filePath);
      res.writeHead(404);
      res.end();
    })
    s.once('fd', function () {res.writeHead(200);});
    s.pipe(res);
}
