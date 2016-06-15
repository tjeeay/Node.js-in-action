var express = require('express');
var res = express.response;

var User = require('./user');

res.message = function (msg, type) {
    type = type || 'info';
    var sess = this.req.session;
    sess.messages = sess.messages || [];
    sess.messages.push({ type: type, string: msg });
}

res.error = function (msg) {
    return this.message(msg, 'error');
}

/**
 * 创建一个中间件：
 * 在每个请求上用 res.session.messages 上的内容组装出 res.locals.messages ，
 * 把消息高效地输出到所有要渲染的模板上
 */
module.exports = function () {
    return function (req, res, next) {
        res.locals.messages = req.session.messages;
        res.locals.removeMessages = function () {
            req.session.messages = [];
        }

        var uid = req.session.uid;
        if (!uid) {
            return next();
        }
        User.get(uid, function(err, user){
            if (err) {
                return next(err);
            }
            req.session.user = res.locals.user = user;
            next(); // 由于方法是异步的，必须要在成功获取用户之后再调用 next() 函数
        });
    }
}