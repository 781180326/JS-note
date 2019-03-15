var http = require('http');


function express(){
    var funcs = {};

    var expr = function(req,res){
        var i = 0;
        function next(){
            var task = funcs[req.url][i++];
            if(!task) return;
            task(req,res,next);     //这里的next相当于一个回调函数，调用与否取决于实际函数内部是否运行这个回调函数
        }
        next();     //第一次路由(输入地址后)触发
    }

    expr.use=function(router,f){
        if( 'string' !== typeof router ){
            f = router;
            router = '/';
        }
        if( !funcs[router] ){
            funcs[router] = [];
        }
        funcs[router].push(f);
    }
    return expr;
}
var app = express();
app.use(function(req, res, next){
    console.log('use1');
    next();     //第二次默认路由触发
});
app.use(function(req, res, next){
    console.log('use2');
    next();
});
app.use('/a',function(req, res, next){
    console.log('use1');
    next();     //第二次'a'路由触发
});
app.use('/a',function(req, res, next){
    console.log('use2');
    next();
});
http.createServer(app).listen('3000', function(){
    console.log('express.use()');
})
