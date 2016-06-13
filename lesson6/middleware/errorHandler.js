function errorHandler(){
    var env = process.env.NODE_ENV || 'development';
    return function(err, req, res, next){
        res.statusCode = 500;
        switch (env) {
            case 'development':
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ 'Error: ': err.toString()}));
                break;
            default:
                res.end('Internal Server error');
                break;
        }
    }
}

module.exports = errorHandler;