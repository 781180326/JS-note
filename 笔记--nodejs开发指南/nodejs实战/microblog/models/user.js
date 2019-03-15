var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
};

User.prototype.save = function (callback) {
    //存入mongodb的文档
    var user = {
        name: this.name,
        password: this.password
    };

    //mongodb命令：https://blog.csdn.net/huxu981598436/article/details/47216493
    mongodb.open(function(err, db){     //打开链接的数据库，返回数据库实例
        if(err){
            return callback(err);
        }

        //读取users的集合
        db.collection('users',function(err, collection){    //获取名为users的collection，返回这个collection
            if(err){
                mongodb.close();
                return callback(err);
            }
            //为name属性添加索引
            collection.ensureIndex('name',{unique: true});
            //写入user文档
            collection.insert(user, {safe: true}, function(err, user){  //向users中插入数据，返回这条数据
                mongodb.close();
                callback(err, user);
            });
        });
    });
};

User.get = function get(username, callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }

        //读取users的集合
        db.collection('users', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //查找name属性为username的文档
            collection.findOne({name: username}, function(err, doc){
                mongodb.close();
                if(doc){
                    //封装文档为user对象
                    var user = new User(doc);
                    callback(err, user);
                }else{
                    callback(err, null);
                }
            });
        });
    });
}



module.exports = exports = User;
