var url = require('url');

module.exports = function (req, res, next) {
    var path = url.parse(req.url).pathname;
    var match = path.match(/^\/blog\/posts\/(.+)/);
    if (match) {
        findPostIdBySlug(match[1], function (err, id) {
            if (err) {
                return next(err);
            }
            if (!id) {
                return next(new Error('Post not found'));
            }
            req.url = '/blog/posts/' + id;
            next();
        });
    } else {
        next();
    }
}

function findPostIdBySlug(slug, cb) {
    var id = (slug == 'Node.js+in+action') ? 1 : undefined; // hard code
    cb(null, id);
}