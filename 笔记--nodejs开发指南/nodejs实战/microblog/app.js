var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');                          //以前的log中间件，express4改了
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var session = require('express-session');              //express session所需
var MongoStore = require('connect-mongo')(session);    //express session所需，需要将session保存在mongodb中
var flash = require('connect-flash');                   //req.flash()所需
var settings = require('./settings');

var fs = require('fs');

var app = express();

var accessLogfile = fs.createWriteStream(path.join(__dirname, 'access.log'),{flags:'a'});
var errorLogfile = fs.createWriteStream('error.log',{flags:'a'});

//所有环境
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//开发环境下
if ('development' == app.get('env')) {

}
//生产环境下
if ('production' == app.get('env')) {
    // console.log('production');

    //访问日志,放在程序最开头
    app.use( logger({ stream: accessLogfile, immediate:true }) );    //immediate设置为true，在请求时就进行记录，否则在响应后再记录
}

app.use(session({
    name: 'bw',                             //connect.sid的名字，获取session.id : req.session.id
    httpOnly: true,                         //禁止使用document.cookie
    secret: settings.cookieSecret,          //用于加密的数据,用来注册session id 到cookie中，相当与一个密钥。
    store: new MongoStore({
        url: 'mongodb://localhost/blog'     //将会话存放在哪个数据库中,session是当浏览器关闭后清除的，所以我认为这个也是临时的一个数据
    })
    //有关express-session的信息请查看：https://www.cnblogs.com/xiashan17/p/5897282.html
}));

app.use(flash());

//动态视图助手
app.use(function(req, res, next){ //因为是默认路由，所以每次请求都会执行这个方法，所以req.session可能会在任意一次请求时改变
    res.locals.user = req.session.user;  //req.session访问session会话
    res.locals.error = req.flash('error').toString();  //req.flash取值，取error的一次性值，只能取一次就会销毁
    res.locals.success = req.flash('success').toString();//req.flash取值，取success的一次性值，只能取一次就会销毁

    //typeof res.locals.error　=> ['已登入']
    //typeof res.locals.success => ['未登入']
    //他们是数组，也就是对象
    //所以 error!==undefined error!==null、success!==undefined success!==null
    next();
});

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));    //配置静态资源

app.use('/', routes);
app.use('/users', users);

//生产环境下
if ('production' == app.get('env')) {
    //错误日志，express3以后使用app.use，传入的函数第一个参数为err，一定要放在路径控制下面，如果放在上面，一定是先执行这个函数，可能此时还没有错误发生，错误发生在路径控制那里，所以放在下面
    app.use( function(err, req, res, next){
        var meta = '[' + new Date() +']' + req.url + '\n' + err.stack + '\n\n';
        errorLogfile.write(meta);
        next();
    } );
}

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});






var debug = require('debug')('my-application');

app.set('port', process.env.PORT || 3000);

if(!module.parent){
    var server = app.listen(app.get('port'), function() {
      console.log('express server listening on port %d in %s mode', server.address().port, app.get('env'));
    });
}


module.exports = app;
