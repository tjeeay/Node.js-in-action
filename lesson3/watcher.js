/**
 * 扩展事件监听器：文件监视器
 * 扩展事件发射器需要三步：
    * (1) 创建类的构造器；
    * (2) 继承事件发射器的行为；
    * (3) 扩展这些行为。
 */

var fs = require('fs'),
    util = require('util'),
    events = require('events');

// 创建类的构造器
function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

// 继承事件发射器的行为，等同于 JavaScript 代码：Watcher.prototype = new events.EventEmitter();
util.inherits(Watcher, events.EventEmitter);

Watcher.prototype.watch = function () {
    var watcher = this;
    fs.readdir(watcher.watchDir, function(err, files){
        if (err) {
            throw err;
        }
        for (var index in files) {
            watcher.emit('process', files[index]);
        }
    });
}

Watcher.prototype.start = function(){
    var watcher = this;
    fs.watchFile(watcher.watchDir, function(curr, prev){
        watcher.watch();
    });
}


var watchDir = './lab/watchDir',
    processedDir = './lab/processedDir';

var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function (file) {
   var watchFile = this.watchDir + '/' + file;
   var processedFile = this.processedDir + '/' + file.toLowerCase();
   fs.rename(watchFile, processedFile, function(err){
      if (err) {
          throw err;
      } 
   });
});

watcher.start();