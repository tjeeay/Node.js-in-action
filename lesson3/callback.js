var http = require('http');
var fs = require('fs');

http.createServer(function (request, response) {
    if (request.url == '/') {
        fs.readFile('./titles.json', function (err, data) {
            if (err) {
                handError(err, response); return;
            }
            
            var titles = JSON.parse(data.toString());
            fs.readFile('./public/template.html', function (err, data) {
                if (err) {
                    handError(err, response); return;
                }
                
                var tmpl = data.toString();
                var html = tmpl.replace('%', titles.join('</li><li>'));
                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.end(html);
            });
        });
    }
}).listen(3000, '127.0.0.1');

function handError(err, response) {
    console.error(err);
    response.end('Server Error: ' + err.message);
}