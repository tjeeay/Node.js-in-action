// var net = require('net');

// var server = net.createServer(function(socket){
//     socket.on('data', function(data){
//        socket.write('Reviced: ' + data); 
//     });
// }).listen(8888);


/**
 * 发布/订阅模式（模拟socket.io）
 */

var net = require('net');
var events = require('events');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function (id, client) {
    var welcome = 'Welcome!\n'
                + 'Guests online: ' + this.listeners('broadcast').length;
    client.write(welcome);
    
    this.clients[id] = client;
    this.subscriptions[id] = function (senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + ' has left the chat.\n');
});

channel.on('shutdown', function(){
   channel.emit('broadcast', '', 'Chat has shut down.\n');
   channel.removeAllListeners('broadcast'); 
});

net.createServer(function (socket) {
    var clientId = socket.remoteAddress + ':' + socket.remotePort;// + (Math.random() * 100);
    channel.emit('join', clientId, socket);
    socket.on('data', function (data) {
        data = data.toString(); // 如果不 toString()，则数据会以 Buffer 的形式传输
        if(data == 'shutdown'){ // 输入 shutdown 命令，则停止提供聊天服务
            channel.emit('shutdown');
        }
        channel.emit('broadcast', clientId, data);
    });
    socket.on('close', function () {
        channel.emit('leave', clientId);
    });
}).listen(8888);
