var express = require('express');
var router = express.Router();

var User = require('../lib/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
  res.render('users/register', {
    title: 'Register'
  });
});

router.post('/register', function (req, res, nexe) {
  var data = req.body.user;
  User.getByName(data.name, function (err, user) {
    if (err) {
      return next(err);
    }
    // redis will default it
    if (user.id) {  // 用户名已经被占用
      res.error('Username already taken!');
      res.redirect('back');
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });
      user.save(function (err) {
        if (err) {
          return next(err);
        }
        req.session.uid = user.id;
        res.redirect('/');
      });
    }
  });
});

router.get('/login', function (req, res, next) {
  res.render('users/login', {
    title: 'Login'
  });
});

router.post('/login', function (req, res, next) {
  var data = req.body.user;
  User.authenticate(data.name, data.pass, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {  // 未找到匹配用户
      res.error('Username or password does not match.');
      res.redirect('back');
    } else {
      req.session.uid = user.id;  // 记录用户登录状态
      res.redirect('/');
    }
  });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
