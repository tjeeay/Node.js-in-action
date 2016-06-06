var EventEmitter = require('events').EventEmitter;

var channel = new EventEmitter();
channel.on('join', function(){
   console.log('Welcome!'); 
});

// 如果不发射 join 事件，日志‘Welcome!’将永远不会输出
channel.emit('join');