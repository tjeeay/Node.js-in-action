var http = require('http');
var mysql = require('mysql');

var work = require('./lib/timetrack.js');

var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'user',
    password: 'abc123',
    database: 'timetrack'
});

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'GET':
            switch (req.url) {
                case '/':
                    work.show(db, res);
                    break;
                case '/archived':
                    work.showArchived(db, res);
                    break;
                default:
                    res.statusCode = 404;
                    res.end('Not Found');
                    break;
            }
            break;
        case 'POST':
            switch (req.url) {
                case '/':
                    work.add(db, req, res);
                    break;
                case '/archive':
                    work.archive(db, req, res);
                    break;
                case '/delete':
                    work.delete(db, req, res);
                    break;
                default:
                    res.statusCode = 404;
                    res.end('Not Found');
                    break;
            }
            break;
        default:
            res.statusCode = 415;
            res.end('Unsuport http method: ' + req.method);
            break;
    }
});


db.query(
    "CREATE TABLE IF NOT EXISTS work ("
    + " id INT(10) NOT NULL AUTO_INCREMENT,"
    + " hours DECIMAL(5,2) DEFAULT 0,"
    + " date DATE,"
    + " archived INT(1) DEFAULT 0,"
    + " description LONGTEXT,"
    + " PRIMARY KEY(id))",
    function (err, args) {
        if (err) {
            throw err;
        }
        server.listen(3000);
        console.log('Server Started...')
    });
