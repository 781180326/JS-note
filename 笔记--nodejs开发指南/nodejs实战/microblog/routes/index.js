var route = require('./route');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', route.index);
router.get('/u/:user', route.user);
router.post('/post', route.checkLogin);//发表文章前判断是否已经退出，已经退出则不继续往下进行，即不进行next()
router.post('/post', route.post);
router.get('/reg', route.reg);
router.post('/reg', route.doReg);
router.get('/login', route.checkNotLogin);//登陆前判断是否已经登陆，已经登陆则不继续往下进行，即不进行next()
router.get('/login', route.login);
router.post('/login', route.doLogin);
router.get('/logout', route.checkLogin);//退出前判断是否已经退出，已经推出则不继续往下进行，即不进行next()
router.get('/logout', route.logout);

module.exports = router;
