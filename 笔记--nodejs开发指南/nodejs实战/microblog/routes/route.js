var crypto = require('crypto');
var User = require('../models/user');
var Post = require('../models/post');
var util = require('util');

var route = {
    index: function(req, res){
        Post.get(null, function(err, posts){
            if(err) {
                post = [];
            }

            res.render('index', {
                title: '首页',
                posts: posts
            });
        });

    },

    user: function(req, res){
        User.get(req.params.user, function(err, user){
            if(!user){
                req.flash('error','用户不存在');
                return res.redirect('/');
            }
            Post.get(user.name, function(err, posts){
                if(err){
                    req.flash('error','获取文件出错');
                    console.log(err);
                    return res.redirect('/');
                }

                res.render('user',{
                    title: user.name,
                    posts: posts
                });
            })
        });

    },

    post: function(req, res){
        var currentUser = req.session.user;
        var post = new Post(currentUser.name, req.body.post);

        if(!post.post){
            req.flash('error', '分享不能为空');
            return res.redirect('/u/'+currentUser.name);
        }

        post.save(function(err, post){
            if(err){
                req.flash('error', '分享出错');
                console.log(err);
                return res.redirect('/');
            }

            req.flash('success', '分享成功');
            res.redirect('/u/'+currentUser.name);
        });
    },

    reg: function(req, res){
        res.render('reg',{title: '用户注册'});
    },

    doReg: function(req, res){
        //req.body就是ＰＯＳＴ请求信息解析过后的对象
        if(req.body['passwordAgain'] !== req.body['password']){
            //req.flash是express提供的工具，通过它保存的变量只会在用户当前和下一次请求中被访问，之后会被清除
            req.flash('error','两次输入的口令不一致');
            //res.redirect();重定向，会向用户返回一个３０３状态，通知浏览器转向相应页面
            return res.redirect('/reg');
        }

        //生成口令的散列值，crypto是Node.js的核心模块，功能是加密并生成各种散列，使用之前需要require
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('base64');

        //User是我们设计的用户对象
        var newUser = new User({
            name: req.body.username,
            password: password
        });

        //user.get的功能是通过用户名获取已知用户，如果存在直接返回，不进行注册，如果不返回则进行注册
        User.get(newUser.name, function(err, user){
            if(user){
                err = 'Username already exists.';
            }
            if(err){
                req.flash('error', err);    //req.flash赋值　error -> err 一次性数据
                return res.redirect('/reg');
            }

            //如果不存在则新增用户
            newUser.save(function(err){
                if(err){
                    req.flash('error', err);　//req.flash赋值　error -> err 一次性数据
                    return res.redirect('/reg');
                }
                //向会话对象写入当前用户信息，后面会通过它判断用户是否已经登录
                // req.session.user = newUser;
                req.flash('success','注册成功');　//req.flash赋值　success -> '注册成功' 一次性数据
                res.redirect('/');
            });
        });
    },

    login: function(req, res){
        res.render('login.ejs', {title: '用户登入'});
    },

    doLogin: function(req, res){
        //对从表单得到的密码进行与存入数据库之前相同的加密
        var md5 = crypto.createHash('md5');     //通过某个算法创建加密实例,常用的算法： md5 sha1 sha256 sha512
        var password = md5.update(req.body.password).digest('base64');  //在hash值的基础上，添加明文更新hash值，然后将更新的内容进行计算得到摘要值。update可以调用多次，最后的结果相当于将多次调用中的所有明文字符串连接进行一次hash值更新  https://cnodejs.org/topic/504061d7fef591855112bab5

        //通过username获取用户注册进数据库的user对象
        User.get(req.body.username, function(err, user){
            if(!user){
                req.flash('error', '用户不存在');
                return res.redirect('/login');
            }

            if(user.password !== password){
                req.flash('error', '用户密码错误');
                return res.redirect('/login');
            }

            req.session.user = user;

            console.log(req.session.id);
            req.flash('success', '登入成功');
            res.redirect('/');
        });
    },

    logout: function(req, res){
        req.session.user = null;
        req.flash('success', '登出成功');
        res.redirect('/');
    },

    checkLogin: function(req, res, next){
        if(!req.session.user){
            req.flash('error','未登入');
            return res.redirect('/');
        }

        next();

    },

    checkNotLogin: function(req, res, next){
        if(req.session.user){
            req.flash('error','已登入');
            return res.redirect('/');
        }

        next();
    }
};

module.exports = exports = route;
