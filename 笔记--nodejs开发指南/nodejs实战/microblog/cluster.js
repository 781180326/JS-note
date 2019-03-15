//cluter.js
var cluster = require('cluster');
var os = require('os');   //操作系统模块

//获取CPU的数量
var numCPUs = os.cpus().length;

var workers = {};
//如果是主进程
if(cluster.isMaster){
    cluster.on('death', function(worker){   //监听由此主进程创建的子进程死亡
        //当一个工作进程结束时，重启工作进程
        delete workers[worker.pis];
        worker = cluster.fork();
        workers[worker.pid] = worker;
    });

    console.log('cpus: %d',numCPUs);

    //初始开启与CPU数量相同的工作进程
    for(var i = 0; i < numCPUs; i++){
        var worker = cluster.fork();        //创建一个子进程
        workers[worker.pid] = worker;
    }
}else{  //如果不是主进程，也就是如果是分支进程
    var app = require('./app');
    app.listen(80);
    console.log(cluster.worker.process.pid);
}

//主进程被终止时，关闭所有工作进程
process.on('SIGTERM',function(){
    for( var pid in workers){
        process.kill(pid);
    }
    process.exit(0);
})
