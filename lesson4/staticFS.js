var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;

var server = http.createServer(function(req, res){
    var url = parse(req.url);
    var path = join(root, 'public', url.pathname);

    // 使用 fs.stat() 检查文件是否存在，及时处理各种可能发生的异常
    fs.stat(path, function(err, stats){
        if (err) {
            if (err.code == 'ENOENT') { // 文件不存在
                res.statusCode = 404;
                res.end('Not Found');
            } else {    // 其他错误
                res.statusCode = 500;
                res.end('Server Internal Error');
            }
            return;
        }
        res.setHeader('Content-Length', stats.size);
        var stream = fs.createReadStream(path);
        stream.pipe(res);
        stream.on('error', function(err){
            res.statusCode = 500;
            res.end('Server Internal Error');
        });
    });
});
server.listen(3000);

