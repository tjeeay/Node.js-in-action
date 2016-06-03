/**
 * 1.5.2 Hello World HTTP服务器

var http = require('http');

// 写法1 - 函数回调方式
http.createServer(function(req, res){
    res.writeHeader(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World');
}).listen(3000);

// 写法2 - 事件监听的方式 
var server = http.createServer();
server.on('request', function(req, res){
   res.writeHeader(200, { 'Content-Type': 'text/plain' });
   res.end('Hello World'); 
});
server.listen(3000);

 */


/**
 * 1.5.3 流数据
 */

var http = require('http');

/**
 * 事件监听方式
 */
var fs = require('fs');
var stream = fs.createReadStream('resource.json');
stream.on('data', function(chunk){
   console.log(chunk); 
});
stream.on('end', function(){
   console.log('finished'); 
});

http.createServer(function(req, res){
    res.writeHeader(200, { 'Content-Type': 'image/jpeg' });
    fs.createReadStream('image.jpg').pipe(res);   // 将图片二进制流以管道方式传输到 res 的输出流中
}).listen(3000);


console.log('Server running at http://localhost:3000');