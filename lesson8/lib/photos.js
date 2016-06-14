
var Photo = require('../models/photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

exports.list = function (req, res) {
    Photo.find({}, function (err, photos) {
        res.render('photos', {
            title: 'Photos',
            photos: photos
        });
    });
}

exports.form = function (req, res) {
    res.render('photos/upload', {
        title: 'Photo upload'
    });
}

exports.submit = function (dir) {
    return function (req, res, next) {
        var img = req.files.photo.image;
        var name = req.body.photo.name || img.name;
        var filePath = join(dir, img.name);
        fs.rename(img.path, filePath, function (err) {
            if (err) {
                return next(err);
            }
            Photo.create({
                name: name,
                path: img.name
            }, function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/index');
            });
        });
    }
}

exports.download = function (dir) {
    return function(req, res, next){
        var id = req.params.id;
        Photo.findById(id, function(err, photo){
           if (err) {
               return next(err);
           } 
           var filePath = join(dir, photo.path);
           //res.sendfile(filePath);    // res.sendfile() 传输数据，对于图片，浏览器会在窗口中显示它们，如果要下载，则改用 res.download()，它会让浏览器提示用户是否下载文件
           res.download(filePath, 'download-file-name.png')
        });
    }
}