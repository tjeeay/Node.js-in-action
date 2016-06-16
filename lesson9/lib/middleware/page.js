module.exports = function (fn, perpage) {
    perpage = perpage || 10;    // 默认每页 10 条
    return function (req, res, next) {
        var page = Math.max(
            parseInt(req.param('page') || '1', 10), 
            1
        ) - 1;  // 将参数 page 解析为十进制的整型值

        fn(function (err, total) {
            if (err) {
                return next(err);
            }
            req.page = res.locals.page = {
                number: page,
                perpage: perpage,
                from: page * perpage,
                to: page * perpage + perpage - 1,
                total: total,
                count: Math.ceil(total / perpage)
            };
            next();
        });
    }
}