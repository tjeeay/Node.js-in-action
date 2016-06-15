var express = require('express');
var router = express.Router();

var Entry = require('../lib/entry');

router.get('/', function (req, res, next) {
    Entry.getRange(0, -1, function (err, entries) {
        if (err) {
            return next(err);
        }
        res.render('entries', {
            title: 'Entries',
            entries: entries
        });
    });
});

router.get('/entries/post', function(req, res, next){
    if (!req.session.user) {
        res.redirect('/');
    }
    res.render('entries/post', {
        title: 'Add New Post'
    });
});

router.post('/entries/post', function(req, res, next){
    var data = req.body.entry;
    var entry = new Entry({
        title: data.title,
        body: data.body,
        username: req.session.user.name
    });
    
    entry.save(function (err) {
       if (err) {
           return next(err);
       } 
       res.redirect('/');
    });  
});

module.exports = router;