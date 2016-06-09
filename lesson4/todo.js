var http = require('http');
var https = require('https');
var qs = require('querystring');
var formidable = require('formidable');
var fs = require('fs');
var parse = require('url').parse;
var join = require('path').join;

var items = [];
var root = __dirname;

var options = {
    key: fs.readFileSync(join(root, 'key.pem')),
    cert: fs.readFileSync(join(root, 'key-cert.pem'))
};

// var server = http.createServer(function (req, res) {
var server = https.createServer(options, function (req, res) {
    if (req.url != '/') {
        var url = parse(req.url);
        var path = join(root, url.pathname);

        // 使用 fs.stat() 检查文件是否存在，及时处理各种可能发生的异常
        fs.stat(path, function (err, stats) {
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
            stream.on('error', function (err) {
                res.statusCode = 500;
                res.end('Server Internal Error');
            });
        });
        return;
    }
    switch (req.method) {
        case 'GET':
            show(res);
            break;
        case 'POST':
            add(req, res);
            break;
        default:
            res.statusCode = 400;
            res.end('Unsupport http method: ' + req.method);
            break;
    }
});
server.listen(3000);

function show(res) {
    var html = '<html><head><title>Todo List</title></head><body>'
        + '<h1>Todo List</h1>'
        + '<ul>'
        + items.map(function (item) {
            return '<li>' + item.title + '<img src="/public/images/' + item.image + '" style="max-width:80px;" onerror="this.remove();" /></li>';
        }).join('')
        + '</ul>'
        + '<form method="post" action="/" enctype="multipart/form-data">'
        + '<p><input type="text" name="title" /></p>'
        + '<p><input type="file" name="image" /></p>'
        + '<p><input type="submit" value="Add Item" /></p>'
        + '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

function add(req, res) {
    if (!isMultipartFormData(req)) {
        res.statusCode = 400;
        return res.end('Bad Request: expecting multipart/form-data');
    }

    var form = new formidable();
    // form.on('field', function(field, value){

    // });
    // form.on('file', function(name, file){

    // });
    // formidable 接收到的文件，会默认存放在 /tmp 目录下
    form.parse(req, function (err, fields, files) {
        //console.log(fields);
        //console.log(files);
        var title = fields['title'];
        var image = '';
        var imageFile = files['image'];
        if (imageFile && imageFile.name != '') {
            image = imageFile.name;
            var stream = fs.createWriteStream('./lesson4/public/images/' + image);
            fs.createReadStream(imageFile.path).pipe(stream);
        }

        var item = {
            title: title,
            image: image
        };
        items.push(item);
        show(res);
    });
    // 可以实时得到目前文件上传的进度，可使用 socket.io 在页面反馈文件上传进度
    form.on('progress', function (bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent + '%');
    });
}

function isMultipartFormData(req) {
    var type = req.headers['content-type'] || '';
    return type.indexOf('multipart/form-data') == 0;
}

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}