var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {            //这个回调函数就是一个控制器，在此处理用户的具体请求
  res.render('index', { title: '<i>Express</i>',name: 'are you?', items: ['1','2','3'] });    //调用模板解析引擎，翻译index模板，并传入一个对象作为参数
  //res.render的功能是调用模板引擎，并将其产生的页面直接返回给客户端。接受两个参数：第一个是模板的名称，也就是视图目录下的模板文件名，不包含文件的扩展名；第二个参数是传递给模板的数据，为一个json对象，用于模板翻译。
});
//并不能写为：
// router = function(req, res) {
//   res.render('index', { title: 'Express' });
// };
//　因为app.use方法是用来加载中间件的，而且在app.js文件中，此文件是以默认路径联系存在的，
// 所以如果在此之前的app.use都运行了next()函数，则这个函数一定会被运行，并且阻止后面的app.use运行，
// 也就是说，如果这样写了，在浏览器中输入一个错误的路径，显示的还是index.ejs模板
//　路由控制要交给app.get()方法
//　这里是use和get配合使用，app.get方法原理上也是一个 function(req, res, next){}函数

router.get('/hello', function(req, res){
    res.render('index', { title: 'hello',name: 'are you?' });
});

router.get('/user', function(req, res){                 //写在带参数的路径匹配前面，检查时如果没有参数就直接使用这个，因为这两个匹配规则对不带参数的路径都有效，则优先匹配先定义的路由规则。如果要将控制权再交给下面的规则，则在函数内部调用next()方法，和app.use一样，就会紧接着调用下面的规则。
    res.render('index', { title: 'hi', name: 'are you?' });
});

router.get('/user/:name', function(req, res){                   //路径匹配，或者和ng2一样，叫路径传参，格式也一样
    res.render('index', { title: 'hi', name: req.params.name });//和ng2一样也是params参数对象
});

router.get(/\/regexp\/([^\/]+)(end)\/?/, function(req, res){
    res.render('index', { title: 'regexp',name: req.params[0] });   //实际上，路径参数会被自动编译为正则表达式，只不过这种写法匹配的参数是匿名的，所以只能通过 req.params[0]、req.params[１]...访问正则表达式中的小括号中的数据，第一个小括号的参数也就是　params[0]...
});


module.exports = router;
