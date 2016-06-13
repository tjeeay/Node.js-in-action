var connect = require('connect');

var api = connect()
    .use(users)
    .use(pets)
    .use(errorHandler);

var app = connect()
    .use(hello)
    .use('/api', api)   // 将 api 中间件挂载到 /api 路由下
    .use(errorPage)
    .listen(3000);  // HTTP 请求会沿着中间件的顺序往下执行

// 现在需要你实现程序中的所有中间件组件：
//   hello 组件会给出响应“Hello World\n.”；
//   如果用户不存在， users 组件会抛出一个 notFoundError ；
//   为了演示错误处理器， pets 会引发一个要抛出的 ReferenceError ；
//   errorHandler 组件会处理来自 api 的所有错误；
//   errorPage 主机会处理来自主程序 app 的所有错误。

/**
 * 实现 hello 中间件组件
 */
function hello(req, res, next) {
    if (req.url.match(/^\/hello/)) {
        res.end('Hello World\n.');
    } else {
        next();
    }
}

var db = {
    users: [
        { name: 'tobi' },
        { name: 'loki' },
        { name: 'jane' }
    ]
};
/**
 * 实现 users 中间件组件
 */
function users(req, res, next) {
    var match = req.url.match(/^\/users\/(.+)/);
    if (match) {
        var user = db.users[match[1]];
        if (user) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(user));
        } else {
            var err = new Error('User not found');
            err.notFound = true;
            next(err);
        }
    } else {
        next();
    }
}

/**
 * 实现 pets 中间件组件
 */
function pets(req, res, next) {
    var match = req.url.match(/^\/pets\/(.+)/);
    if (match) {
        foo();  // 因为函数foo()没有定义，当有 HTTP 请求时，此处会报错：ReferenceError: foo is not defined
    } else {
        next();
    }
}

/**
 * 实现 errorHandler 中间件组件
 */
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.setHeader('Content-Type', 'application/json');
    if (err.notFound) {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: err.message }));
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server Internal Error' }));
    }
    next(err);
}

/**
 * 实现 errorPage 中间件组件
 */
function errorPage(err, req, res, next) {
    console.error('Application Error: %s', err.stack);
}
