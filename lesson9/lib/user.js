var redis = require('redis');
var bcrypt = require('bcrypt');

var db = redis.createClient();  // 创建到 Redis 的长连接

function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.save = function (fn) {
    if (this.id) {  // 用户已存在
        this.update(fn);
    } else {
        var user = this;
        db.incr('user:ids', function (err, id) {  // 增加 user:ids 的值，给用户一个唯一的 id
            if (err) {
                return fn(err);
            }
            user.id = id;
            user.hashPassword(function (err) {    // 密码哈希
                if (err) {
                    return fn(err);
                }
                user.update(fn);
            });
        });
    }
}

User.prototype.update = function (fn) {
    var user = this;
    var id = user.id;
    db.set('user:id:' + user.name, id, function (err) { // 用名称索引用户 id
        if (err) {
            return fn(err);
        }
        db.hmset('user:' + id, user, function (err) {   // 用 Redis 哈希存储数据
            fn(err);
        });
    });
}

// 这个哈希处理会加盐。每个用户加的盐不一样，可以有效对抗彩虹表攻击：对于哈希机制而言，盐就像私钥一样。bcrypt可以用 genSalt() 为哈希生成12个字符的盐。
User.prototype.hashPassword = function (fn) {
    var user = this;
    bcrypt.genSalt(12, function (err, salt) {   // 生成有 12 个字符的盐
        if (err) {
            return fn(err);
        }
        user.salt = salt;
        bcrypt.hash(user.pass, salt, function (err, hash) { // 生成加密过的 hash 密码
            if (err) {
                return fn(err);
            }
            user.pass = hash;
            fn();
        });
    });
}

User.getByName = function (name, fn) {
    User.getId(name, function (err, id) {
        if (err) {
            return fn(err);
        }
        User.get(id, fn);
    })
}

User.getId = function (name, fn) {
    db.get('user:id:' + name, fn);
}

User.get = function (id, fn) {
    db.hgetall('user:' + id, function (err, user) {
        if (err) {
            return fn(err);
        }
        fn(null, new User(user));
    })
}

User.authenticate = function (name, pass, fn) {
    User.getByName(name, function (err, user) {
        if (err) {
            return fn(err);
        }
        // 当查找不存在的键时，Redis 会给你一个空的哈希值，所以这里所用的检查是 !user.id ，而不是 !user 。
        if (!user.id) {   // 用户不存在
            return fn();
        }
        bcrypt.hash(pass, user.salt, function (err, hash) {
            if (err) {
                return fn(err);
            }
            if (hash == user.pass) {    // 匹配发现项
                return fn(null, user);
            }
            fn();
        });
    })
}

module.exports = User;


// test
// var tobi = new User({
//     name: 'Tobi',
//     pass: 'im a ferret',
//     age: 20
// });
// tobi.save(function (err) {
//     if (err) {
//         throw err;
//     }
//     console.log('user id %d', tobi.id);
// });