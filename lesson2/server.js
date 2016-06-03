/**
 * 2.3.1 创建静态文件服务器
 */

var http = require('http');
var fs = require('fs');
var path = require('path');

// 第三方 library，用来根据文件扩展名得出MIME-TYPE
var mime = require('mime');

// Cache 用来缓存文件内容
var cache = {};



// 发送404错误
function send404(response) {
    response.writeHeader(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: resource not found.');
    response.end();
}

// 主要在返回静态文件内容时，处理正确的 MIME-TYPE 类型
function sendFile(response, filePath, fileContents) {
    response.writeHeader(200, { 'Content-Type': mime.lookup(path.basename(filePath)) });
    response.end(fileContents);
}

function serverStatic(response, cache, absPath){
    if(cache[absPath]) { //检查文件是否缓存在内存中
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {   // 检查文件是否存在
            if(exists) {
                fs.readFile(absPath, function(err, data) {  // 从硬盘中读取文件
                    if(err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}



var server = http.createServer(function(request, response) {
   var filePath;
   if(request.url == '/') {
       filePath = 'public/index.html';  // 返回默认 HTML 文件
   } else {
       filePath = 'public' + request.url;
   }
   
   var absPath = './' + filePath;
   serverStatic(response, cache, absPath);
});

server.listen(3000, function() {
    console.log('Server listening on port 3000.');
});