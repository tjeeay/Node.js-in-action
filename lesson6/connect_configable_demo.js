/**
 * 可配置中间件组件示例
 */

var connect = require('connect');
var logger = require('./middleware/logger');    // 自定义 logger 组件
var router = require('./middleware/router');
var urlRewriter = require('./middleware/urlRewriter');
var errorHandler = require('./middleware/errorHandler');

var routes = {
    GET: {
        '/users': function(req, res){
            res.end('tobi, loki, ferret');
        },
        '/users/:id': function(req, res, id){
            res.end('user ' + id);
        }
    },
    DELETE: {
        'users/:id': function(req, res, id){
            res.end('deleted user ' + id);
        }
    }
};

var app = connect();
app.use(logger(':method :url'));
app.use(router(routes));
app.use(urlRewriter);
app.use(hello);
app.use(errorHandler());
app.listen(3000);

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