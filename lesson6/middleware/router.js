var parse = require('url').parse;

module.exports = function(obj){
    // 可以利用闭包的能力在外层函数中缓存正则表达式，免得在每个请求之前都要重新编译一次。
    var reg1 = /\//g;
    var reg2 = /:(\w+)/g;

    return function(req, res, next){
        if (!obj[req.method]) { // 如果 req.method 在配置中未定义，则调用 next()，并停止一切后续操作
            next();
            return;
        }

        var routes = obj[req.method];
        var paths = Object.keys(routes);
        var url = parse(req.url);   // 解析 URL，以便跟 pathname 匹配

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var fn = routes[path];
            var replacedPath = path
                .replace(reg1, '\\/')
                .replace(reg2, '([^\\/]+)');
            var reg = new RegExp('^' + replacedPath + '$'); // 构造正则表达式
            var captures = url.pathname.match(reg); // 尝试跟 pathname 匹配
            if (captures) {
                var args = [req, res].concat(captures.slice(1));    // 传递被捕获的分组
                fn.apply(null, args);
                return; // 当有相匹配的函数时，返回！ 以防止后续的 next() 调用
            }
        }
        next();
    }
};