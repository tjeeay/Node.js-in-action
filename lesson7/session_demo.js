var connect = require('connect');
var favicon = require('serve-favicon');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

var hour = 3600000; // ms
var sessionOptions = {
    secret: 'my sid',
    cookie: { maxAge: hour * 24 , secure: false }, // secure=true 仅支持 https 请求
    store: new RedisStore({ prefix: 'sid' })
}

var app = connect();
app.use(session(sessionOptions));
app.use(favicon('./fav.ico')); // 处理 favicon 的请求
app.use(function (req, res, next) {
    var sess = req.session;
    if (sess.views) {
        sess.views++;   // 必须在 res.end() 之前累加 session，否则会无效
        console.log(sess.cookie);
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + sess.views + '</p>');
        res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + '</p>');
        res.write('<p>httpOnly: ' + sess.cookie.httpOnly + '</p>');
        res.write('<p>path: ' + sess.cookie.path + '</p>');
        res.write('<p>domain: ' + sess.cookie.domain + '</p>');
        res.write('<p>secure: ' + sess.cookie.secure + '</p>');
        res.end();
    } else {
        sess.views = 1;
        res.end('welcome to the session demo. refresh!');
    }
});
app.listen(3000);