/**
 * ** Notice **
 * 在构建中间件时，你应该
 * 关注那些小型的、可配置的部分。构建大量微小的、模块化的、可重用的中间件组件，
 * 合起来搭成你的程序。保持中间件的小型化和专注性真的有助于将复杂的程序逻辑分解
 * 成更小的组成部分
 */

var connect = require('connect');

connect()
    .use(logger)
    .use('/admin', restrict)    // 当 use() 的第一个参数是字符串时，
    .use('/admin', admin)       // 只有 URL 前缀与之匹配时，Connect 才会调用后面的中间件
    .use(hello)
    .listen(3000);

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next(); // 调用 next() 函数后，中间件组件会把控制权交回给 dispatcher，才能继续执行后面的中间件
}

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
}

function restrict(req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization) {
        return next(new Error('Unauthorized'));
    }
    var parts = authorization.split(' ');
    var scheme = parts[0];
    var auth = new Buffer(parts[1], 'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];

    authenticateWithDatabase(user, pass, function (err) {
        if (err) {
            return next(err);   // 告诉 dispatcher 出错了
        }
        next();
    })
}

function authenticateWithDatabase(user, pass, cb) {
    if (user != 'admin' && pass != '123456') {
        cb(new Error('Unauthorized: user or password does not match.'));
    }
    cb();
}

function admin(req, res, next) {
    switch (req.url) {
        case '/':
            res.end('try /users');
            break;
        case '/users':
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(['tobi', 'liki', 'jane']));  // hard code
            break;
        default:
            res.statusCode = 404;
            res.end('Not Found');
            break;
    }
}