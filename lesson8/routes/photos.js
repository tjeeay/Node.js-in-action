
var photos = [];
photos.push({
    name: 'Node.js Logo',
    path: 'http://tse1.mm.bing.net/th?&id=OIP.M3162fe7b4bb60f4b531d858e33048f4cH0&w=300&h=150&c=0&pid=1.9&rs=0&p=0'
});
photos.push({
    name: '老厂房',
    path: 'http://tse1.mm.bing.net/th?&id=OIP.M36c0a97be7609918210929088d67eb71o0&w=300&h=180&c=0&pid=1.9&rs=0&p=0'
});
photos.push({
    name: '火焰大片',
    path: 'http://tse1.mm.bing.net/th?&id=OIP.M81a7889fd964839ae5fc8e86538003d5o0&w=300&h=200&c=0&pid=1.9&rs=0&p=0'
});

var express = require('express');
var router = express.Router();

module.exports = router.get('/', function(req, res){
    res.render('photos', {
        title: 'Photos',
        photos: photos
    });
});