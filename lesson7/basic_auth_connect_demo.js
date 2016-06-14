var connect = require('connect');
var basicAuth = require('basic-auth-connect');

var app = connect();
// 1. 基本用法 basicAuth('user', 'password')
app.use(basicAuth('admin', '123456'));
// 2. 提供回调函数
// app.use(basicAuth(function(user, pass){
//     return (user == 'admin' && pass == '123456');   // 返回 true 表示认证通过
// }));
// 3. 提供异步回调函数
// app.use(basicAuth(function(user, pass, callback){
//     // 可以使用异步函数去数据库校验
//     User.authenticate({user: user, pass: pass}, gotUser);
//     function gotUser(err, user){
//         if (err) {
//             return callback(err);
//         }
//         callback(null, user);
//     }
// }));

app.use(function(req, res, next){
    res.end('I am a secret.');
});

app.listen(3000);