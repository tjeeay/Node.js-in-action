var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

connect()
.use(cookieParser('secret key'))
.use(bodyParser())
.use(function(req, res, next){
    console.log('req.cookies');
    console.log(req.cookies);
    console.log('req.signedCookies');
    console.log(req.signedCookies);

    console.log('req.body');
    console.log(req.body);
})
.listen(3000);