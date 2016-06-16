
/**
 * 解析 entity[field] 格式的字段
 */
function parseField(field) {
    return field
        .split(/\[|\]/)
        .filter(function (s) {
            return s;
        });
}

/**
 * 基于 parseField() 的结果查找属性
 * 传入的 field 是一个 array，e.g. ["entry", "title"]
 */
function getField(req, field) {
    var val = req.body;
    field.forEach(function (prop) {
        val = val[prop];
    });
    return val;
}

/**
 * 验证字段必填的中间件
 */
module.exports.required = function (field) {
    field = parseField(field);  // 解析输入域
    return function (req, res, next) {
        if (getField(req, field)) { // 检查字段是否有值
            next();
        } else {
            res.error(field.join(' ') + ' is required');
            res.redirect('back');
        }
    }
}

/**
 * 验证字段长度的中间件
 */
module.exports.lengthAbove = function (field, len) {
    field = parseField(field);  // 解析输入域
    return function (req, res, next) {
        if (getField(req, field).length > len) { // 检查字段是否有值
            next();
        } else {
            res.error(field.join(' ') + ' must have more than ' + len + ' characters');
            res.redirect('back');
        }
    }
}