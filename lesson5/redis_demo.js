var redis = require('redis');

// 连接 Redis 服务器
var client = redis.createClient(6379, '127.0.0.1');
client.on('error', function (err) {
    console.log('Error ' + err);
});

// 操作 Redis 中的数据
// 1) 存储、获取 String 格式数据
client.set('color', 'red', redis.print);    // redis.print 函数输出操作结果，或在错误时输出错误
client.get('color', function (err, value) {
    if (err) {
        throw err;
    }
    console.log('Got: ' + value);
});

// 2) 用 Hashes 存储和获取数据
client.hmset('camping', {
    'shelter': '2-person tent',
    'cooking': 'campstove'
}, redis.print);    // redis.print 函数输出操作结果，或在错误时输出错误
client.hget('camping', 'cooking', function (err, value) { // 获取元素 cooking 的值
    if (err) {
        throw err;
    }
    console.log('Will be cooking with: ' + value);
});
client.hkeys('camping', function (err, keys) {    // 获取哈希表的键
    if (err) {
        throw err;
    }
    keys.forEach(function (key, i) {
        console.log(' ' + key);
    });
});

// 3) 用 Lists 存储和获取数据（Redis链表是有序的字符串链表）
client.lpush('tasks', 'Paint the bikeshed red', redis.print);
client.lpush('tasks', 'Paint the bikeshed green', redis.print);
client.lrange('tasks', 0, -1, function (err, items) { // start 为0，end 为-1表明到链表最后一个元素
    if (err) {
        throw err;
    }
    items.forEach(function (item, i) {
        console.log(' ' + item);
    });
});

// 4) 用 Sets 存储和获取数据（集合中的元素必须是唯一的，如果你试图把两个相同的值存到集合中，第二次尝试会被忽略）
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '204.10.37.96', redis.print);
client.sadd('ip_addresses', '72.32.231.8', redis.print);
client.smembers('ip_addresses', function (err, members) {
    if (err) {
        throw err;
    }
    console.log(members);
});

// 5) 用 channel(信道) 传递数据（Pub/Sub模式）
// 下面用 Redis 的 Pub/Sub 功能实现 TCP/IP 聊天服务器

var net = require('net');

var server = net.createServer(function (socket) {
    var subscriber;
    var publisher;

    socket.on('connect', function () {
        subscriber = redis.createClient();
        subscriber.subscriber('main_chat_room');

        subscriber.on('message', function (channel, message) {
            socket.write('Channel ' + channel + ': ' + message);
        });

        publisher = redis.createClient();
    });

    socket.on('data', function (data) {
        publisher.publish('main_chat_root', data);
    });
    socket.on('end', function () {
        subscriber.unsubscribe('main_chat_room');
        subscriber.end();
        publisher.end();
    });
});
server.listen(3000);    // 启动聊天服务器

/** NODE_REDIS性能最大化 （附录）
 * 在你准备把使用了node_redis API的Node.js程序部署到生产环境中时，可能要考虑下是否使
 * 用Pieter Noordhuis的hiredis模块（https://github.com/pietern/hiredis-node）。这个模块会显著提升
 * Redis的性能，因为它充分利用了官方的hiredis C语言库。如果你装了hiredis，node_redis API会自
 * 动使用hiredis替代它的JavaScript实现。
 */