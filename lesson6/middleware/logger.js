function setup(format) {
    var regexp = /:(\w+)/g; // 匹配以冒号':'开头

    return function logger(req, res, next) {
        var str = format.replace(regexp, function (match, property) {
            return req[property];
        });
        console.log(str);
        next(); // 将控制权交给下一个中间件组件
    }
}

module.exports = setup; // 直接导出 logger 的 setup 函数

