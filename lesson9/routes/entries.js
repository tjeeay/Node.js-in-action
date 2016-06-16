var express = require('express');
var router = express.Router();

var Entry = require('../lib/entry');
var validate = require('../lib/middleware/validate');
var page = require('../lib/middleware/page');

// page 中间件提供分页功能
// 注意：:page? 参数为可选参数，如未指定，默认第一页
// 尤其注意：由于 :page? 参数可选：参数 :page 可能会处理 /upload 这样的路由路径。一种简单的解决办法是把这个路由定义放在其他路由定义下边。让它做最后一个路由定义。这样更具体的路由会在到达这个路由定义之前找到匹配项。
router.get('/:page?', page(Entry.count, 2), function (req, res, next) {
    var page = req.page;
    Entry.getRange(page.from, page.to, function (err, entries) {
        if (err) {
            return next(err);
        }
        res.render('entries', {
            title: 'Entries',
            entries: entries
        });
    });
});

router.get('/entries/post', function(req, res, next){
    if (!req.session.user) {
        res.redirect('/');
    }
    res.render('entries/post', {
        title: 'Add New Post'
    });
});

router.post('/entries/post', 
    validate.required('entry[title]'),
    validate.lengthAbove('entry[title]', 4), 
        function(req, res, next){
        var data = req.body.entry;
        var entry = new Entry({
            title: data.title,
            body: data.body,
            username: req.session.user.name
        });
        
        entry.save(function (err) {
        if (err) {
            return next(err);
        } 
        res.redirect('/');
        });  
    }
);

module.exports = router;