var express = require('express');   //express模块导出的是一个方法，调用这个方法会返回一个app函数
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index'); //为指定路径组织返回的内容，相当于ＭＶＣ中的控制器
var users = require('./routes/users');

var app = express();    //创建了一个app函数，这个函数拥有很多方法

// view engine setup
app.set('views', path.join(__dirname, 'views'));    //设置页面模板的位置
app.set('view engine', 'ejs');                      //设置模板引擎
/*
    app.set　是express的参数设置工具，接受一个键和一个值，可用的参数(键)有：
            basepath                基础地址，通常用于res.redirect()跳转
            views                   视图目录的路径，存放模板文件
            view engine             视图模板引擎
            view options            全局视图参数对象
            view cache              启用视图缓存
            case sensitive routes   路径区分大小写
            strict routing          严格路径，启用后会忽略路径末尾的'/'
            jsonp callback          开启透明的JSONP支持
*/

/*
    通过app.use启用中间件,实际就是根据路由地址启用相应的逻辑，和angular4一样，从上到下查询路由，但是并不是路由控制器，express的路由控制使用app.get，app.use只是一个中间逻辑的联系分配

    由于默认的路径为 /，中间件挂载没有指定路径，只要前面的默认路径方法都执行了next()，那么对于每个请求，这个中间件都会被执行

    中间件的形式：function(req, res, next){}，　next()方法用来调用后面的路由方法
        如果调用了next()方法，会查询并执行符合路由名的下一个方法
        如果这个中间件没有调用next()方法，那么后面的相同路径名的方法就都不会执行，默认路径名'/'也一样
        如果查找一个非'/'的路径，会在两个路径名函数数组下进行next()遍历，一个是默认路径名'/'，另一个是实际路径名
        如果next()方法接受了参数，则代表发生错误。

    https://blog.csdn.net/xujingzhong0077/article/details/71600742
    https://blog.csdn.net/tian361zyc/article/details/72818363
*/
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());         //bodyParser的功能：解析客户端请求，通常是通过POST发送的内容
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));    //提供静态文件支持

//静态视图助手
app.locals.appName = 'microblog';
app.locals.sayHello = function(){
    return 'welcome microblog';
}
//动态视图助手
app.use(function(req, res, next){
    res.locals.appUrl = req.url;
    res.locals.welcome = function(){
        return 'welcome emmmmm'
    }
    next();
});


app.use('/', routes);       //没有调用 next()
app.use('/hello', routes);  //同一个路由控制器，要放在'/'下面，如果放在上面，当'/hello'路径不运行next()时，'/'默认路径函数数组中的遍历并没有停下
app.use('/user', routes);
app.use('/regexp', routes);
app.use('/users', users);   //没有调用 next()

    // routes是一个指向路由控制器的方法
    // users是一个指向路由控制器的方法
    //浏览器发起请求，由路由控制器接收，根据不同的路径定向到不同的控制器
    //控制器处理用户的具体请求，可能会访问数据库中的对象，即模型部分
    //控制器还要访问模板引擎，生成视图的ＨＴＭＬ，最后再由控制器返回给浏览器。


// app.use('/a',function(req, res, next){
//     console.log('use1');
//     next();
// });
// app.use('/a',function(req, res, next){
//     console.log('use2');
//     next();
// });
//输入地址 localhost:3000/a 　　跳转到404页面，因为执行了 next()，而　404又是默认路由，所以４０４会被执行



// catch 404 and forwarding to error handler
app.use(function(req, res, next) {      //路由名称都不匹配时触发４０４，相当于angular4中的 router: '**'
    var err = new Error('Not Found');   //当路径是一个不存在的路由规则，而且也不是一个public目录下的文件，就会触发４０４
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//控制权转移例子：
var users = {
    'byvoid': {
        name: 'bw',
        website: 'http://bwhite.com'
    }
};
app.all('/use/:username', function(req, res, next){
    if(users[req.params.username]){ //判断此用户是否存在
        next();                     //控制权转移，all匹配任何请求，如果来了一个get请求，next()会将这个请求的控制权交给下一个get绑定函数，其他类型的请求绑定函数也是同理。
    }else{
        next(new Error(req.params.username + ' does not exist. ')); //如果next()方法接受了参数，则代表发生错误。
    }
});
app.get('use/:username', function(req, res){       //get查询信息
    res.send(JSON.stringify(users[req.params.username]));
});
app.put('use/:username', function(req, res){       //put修改用户信息
    res.send('Done');
});





module.exports = app;
