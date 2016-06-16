var express = require('express');
var router = express.Router();
var basicAuth = require('basic-auth-connect');

var User = require('../lib/user');
var Entry = require('../lib/entry');

var page = require('../lib/middleware/page');

// basicAuth() 中间件以一个函数为参数执行认证，函数签名为 (username, password, callback) 。
// 你的 User.authentication 函数非常符合这一要求
router.use('/', basicAuth(User.authenticate));

// curl http://admin:123456@localhost:3000/api/users/1
router.get('/users/:id', function (req, res, next) {
    var id = req.param('id');
    User.get(id, function (err, user) {
       if (err) {
           err;
       } 
       res.json(user.toJSON());
    });
});

router.get('/entries/:page?', page(Entry.count, 2), function (req, res, next) {
    var page = req.page;
    Entry.getRange(page.from, page.to, function (err, entries) {
        if (err) {
            return next(err);
        }

        // 实现内容协商：
        // HTTP通过 Accept 请求头域提供了内容协商机制，让客户端指定需要返回何种格式 JSON, XML OR HTML
        res.format({
            'application/json': function () {
                res.send(entries);
            },
            'application/xml': function () {
                // 对于 xml 或 html 格式，可以利用视图模板进行返回
                res.render('entries/xml', {
                    entries: entries
                });
            },
            'default': function () {    // 如果用户没有请求你显式处理的格式，会执行这个默认的
                res.end('Unknow Accept format');
            }
        });
    });
});

module.exports = router;