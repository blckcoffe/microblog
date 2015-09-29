var express = require('express');
var app = express();
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user.js');
var Post = require('../models/post.js');
var templatePath = require.resolve('../views/index.jade')
var templateFn = require('jade').compileFile(templatePath);
var cluster= require('cluster');


var indexValue = {
        "title": "P2P home",
        "title2": "Microblog2",
        "tablecontent":[{
            "name":"Tanmay",
            "city": "Sachin" },{
            "name":"Lari",
            "city": "Shanghai"
}]
};

/* GET home page. */
router.get('/', function(req, res, next) {
/*  Post.get(null, function(err, posts) {
    if (err) {
      posts = [];
    }
    res.render('index', {
        title: 'Microblog1',
        tablecontent:[{
            "name":"Tanmay",
            "city": "Sachin" },{
            "name":"Tanmay",
            "city": "Sachin"
        }],
        posts: posts,
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString()
    });
  });*/

    var Value = {
      "title": 'P2P home',
      "title2": "Microblog2",
      "user": req.session.user,
      "Administrator":true,
      "tablecontent":[{
        "name":"Tanmay",
        "city": "Sachin" },{
        "name":"Lari",
        "city": "Shanghai"
      }]
    };


    res.write(templateFn(Value));
    res.end();

//  res.render('index', { title: 'Express' });
});

router.get("/reg", checkNotLogin);
router.get("/reg",function(req,res) {
  res.render("reg",{
    title : "用户注册"
  });
});

router.get("/changepwd",function(req,res) {
  res.render("changepwd",{
    title : "Change Password"
  });
});

router.get("/login", checkNotLogin);
router.get("/login",function(req,res) {
  res.render("login",{
    title:"用户登录"
  });
});

router.get("/logout", checkLogin);
router.get("/logout",function(req,res) {
  req.session.user = null;
  req.flash('success', '退出成功');
  res.redirect('/');
});

router.get("/user", function(req,res){
  res.render("user",{
    title: "用户页面"
  });
});

router.get("/tablecontent",function(req,res){
    res.json(indexValue.tablecontent);
});

router.post("/login", checkNotLogin);
router.post("/login",function(req,res) {
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  User.get(req.body.username, function(err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }

    if (user.password != password) {
      req.flash('error', '用户名或密码错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', req.session.user.name + '登录成功');

    res.redirect('/');
  });
});

router.post("/userinfor", function(req, res ){
    console.log("Created successfully");
});

router.post("/reg", checkNotLogin);
router.post("/reg", function(req, res) {
  console.log(req.body['password']);
  console.log(req.body['password-repeat']);
  if(req.body['password-repeat'] != req.body['password']){
    req.flash('error', '两次输入的密码不一致');
    return res.redirect('/reg');
  }
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');

  var newUser = new User({
    name: req.body.username,
    password: password
  });
  //Check if the user already exist
  User.get(newUser.name, function(err, user) {
    if (user) {
      err = 'Username already exists.';
    }
    if (err) {
      req.flash('error', err);
      return res.redirect('/reg');
    }

    newUser.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.session.user = newUser;
      req.flash('success', req.session.user.name+'注册成功');
      res.redirect('/');
    });
  });
});

router.post("/changepwd", function(req, res) {

  var md5 = crypto.createHash('md5');
  console.log(req.body['oldpassword']);
  var oldpassword = md5.update(req.body['oldpassword']).digest('base64');

  User.get(req.session.user.name, function(err, user) {
    if (user.password != oldpassword) {
      req.flash('error', '用户名或密码错误');
      return res.redirect('/changepwd');
    }
  });

  console.log(req.body['newpassword']);
  console.log(req.body['password-repeat']);
  if(req.body['password-repeat'] != req.body['newpassword']){
    req.flash('error', '两次输入的密码不一致');
    return res.redirect('/changepwd');
  }

  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body['newpassword']).digest('base64');
  var newUser = new User({
    name: req.session.user.name,
    password: password
  });

  newUser.save(function(err) {
    if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      req.flash('success', req.session.user.name+'Pass World Change Sccueed!');
      res.redirect('/');
    });
  });


function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '用户已经登录');
    return res.redirect('/');
  }
  next();
}
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '用户尚未登录');
    return res.redirect('/login');
  }
  next();
}

router.post("/post",checkLogin);
router.post("/post",function(req,res) {
  var currentUser = req.session.user;
  var post = new Post(currentUser.name, req.body.post);
  post.save(function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    req.flash('success', '发表成功');
    res.redirect('/u/' + currentUser.name);
  });
});

router.get("/u/:user",function(req,res) {
  User.get(req.params.user, function(err, user) {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/');
    }
    Post.get(user.name, function(err, posts) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      res.render('user', {
        title: user.name,
        posts: posts
      });
    });
  });
});

router.get("/userinfor",function(req,res){
  res.render("userinfor",{});
});

module.exports = router;
