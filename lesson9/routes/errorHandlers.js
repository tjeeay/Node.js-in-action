exports.notFound = function (app) {
    return function (req, res, next) {
        res.status(404).format({
            html: function () {
                res.render('404');
            },
            json: function () {
                res.send({ message: 'Resource not found' });
            },
            xml: function () {
                res.write('<error>\n');
                res.write(' <message>Resource not found</message>\n');
                res.write('</error>\n');
            },
            text: function () {
                res.send('Resource not found');
            }
        });
    }
}

exports.error = function (app) {
    return function (err, req, res, next) {
        console.error(err.stack);   // 将错误输出到 stderr 流中
        var msg;

        switch (err.type) { // 报错时，可指定 err.type，针对特定错误做特殊处理
            case 'database':
                msg = 'Server Unavailable';
                res.statusCode = 503;
                break;
            default:
                msg = 'Internal Server Error';
                res.statusCode = 500;
                break;
        }

        res.format({
            html: function () {
                // development error handler
                // will print stacktrace
                if (app.get('env') === 'development') {
                    res.render('5xx', {
                        msg: err.stack,
                        status: res.statusCode
                    });
                } else {
                    // production error handler
                    // no stacktraces leaked to user
                    res.render('5xx', {
                        msg: msg,
                        status: res.statusCode
                    });
                }
            },
            json: function () {
                if (app.get('env') === 'development') {
                    res.send({ error: err.stack });
                } else {
                    res.send({ error: msg });
                }
            }
        });
    }
}