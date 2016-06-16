var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var messages = require('./lib/messages');

var routes = require('./routes/index');
var users = require('./routes/users');
var entries = require('./routes/entries');
var api = require('./routes/api');

var errorHandlers = require('./routes/errorHandlers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var hour = 3600000; // ms
var sessionOptions = {
  secret: 'my sid',
  cookie: { maxAge: hour * 24, secure: false }, // secure=true 仅支持 https 请求
  //store: new RedisStore({ prefix: 'sid' })
}
app.use(session(sessionOptions));
// 消息处理中中间件（应该把这个中间件放在中间件 session 下面，因为它依赖于 req.session ）
app.use(messages());

app.use('/', entries);
app.use('/api', api);
app.use('/users', users);

// error handlers

// catch 404 and forward to error handler
app.use(errorHandlers.notFound(app));

// catch error
app.use(errorHandlers.error(app));


module.exports = app;
