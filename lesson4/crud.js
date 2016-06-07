var http = require('http');
var url = require('url');

var items = [];


var server = http.createServer(function (request, response) {
    switch (request.method) {
        case 'GET':
            var body = items.map(function (item, index) {
                return index + ')' + item;
            }).join('\n');
            // 你可能想用 body.length 的值设定 Content-Length ，
            // 但 Content-Length 的值应该是字节长度，不是字符长度，并且如果字符串中有多字节字符，两者的长度是不一样的。
            // 为了规避这个问题，Node提供了一个 Buffer.byteLength() 方法。
            response.setHeader('Content-Length', Buffer.byteLength(body));
            response.setHeader('Content-Type', 'text/plain;charset-"utf-8"');
            response.end(body);
            break;
        case 'POST':
            var item = '';
            // 将进来的 data 事件编码为 UTF-8 字符串（否则 chunk 默认为 Buffer 类型）
            request.setEncoding('utf8');
            request.on('data', function(chunk){
                item+=chunk;
            });
            request.on('end', function(){
                items.push(item);
                response.end('OK\n');
            });
            break;
        case 'PUT':
            // 解析 url 中的参数
            var pathname = url.parse(request.url).pathname;
            var index = parseInt(pathname.slice(1));

            if (isNaN(index)) {
                response.statusCode = 400;
                response.end('Invalid item id');
            } else if (!items[index]) {
                response.statusCode = 404;
                response.end('Item not found');
            } else {
                var newItem = '';
                request.setEncoding('utf8');
                request.on('data', function(chunk){
                    newItem += chunk;
                });
                request.on('end', function(){
                    // 更新 item
                    items[index] = newItem;
                    response.end('Update item successfuly.\n');
                });
            }
            break;
        case 'DELETE':
        // 解析 url 中的参数
            var pathname = url.parse(request.url).pathname;
            var index = parseInt(pathname.slice(1));

            if (isNaN(index)) {
                response.statusCode = 400;
                response.end('Invalid item id');
            } else if (!items[index]) {
                response.statusCode = 404;
                response.end('Item not found');
            } else {
                items.splice(index, 1);
                response.end('Delete item successfuly.\n');
            }
            break;
        default:
            response.writeHead(400);
            response.end('Unsupport http method: ' + request.method);
            break;
    }
});

server.listen(3000, 'localhost');