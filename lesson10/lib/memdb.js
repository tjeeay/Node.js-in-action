var db = [];

exports.save = function (doc, cb) {
    db.push(doc);
    if (cb) {
        setTimeout(function () {
            cb();
        }, 1000);
    }
}

exports.first = function (obj) {
    return db.filter(function (doc) {
        for (var key in obj) {
            if (doc[key] != obj[key]) {
                return false;
            }
        }
        return true;    // 所有属性匹配，才返回
    }).shift();
}

exports.clear = function () {
    db = [];
}