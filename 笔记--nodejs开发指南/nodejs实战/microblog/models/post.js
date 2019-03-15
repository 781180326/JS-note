var mongodb = require('./db');

function Post(username, post, time){
    this.user = username;
    this.post = post;
    if(time){
        this.time = time;
    }else{
        this.time = new Date();
    }
};

Post.prototype.save = function save(callback){
    var post = {
        user: this.user,
        post: this.post,
        time: this.time
    };

    mongodb.open(function(err, db){
        if(err) {
            return callback(err);
        }

        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //为user属性添加索引
            collection.ensureIndex('user');

            //insert
            collection.insert(post, { sate: true }, function(err, post){
                mongodb.close();
                callback(err, post);
            });
        });
    });
};

Post.get = function get(username, callback){
    mongodb.open(function(err, db){
        if(err) {
            return callback(err);
        }

        db.collection('posts', function(err, collection){
            if(err){
                mongodb.close();
                return callback(err);
            }

            //查找user属性为username的文档，如果username不存在则查找全部文档
            var query = {};

            if(username){
                query.user = username;
            }

            collection.find(query).sort({time:-1}).toArray(function(err, docs){
                mongodb.close();
                if(err){
                    callback(err);
                }

                var posts = [];
                docs.forEach(function(doc, index){
                    var post = new Post(doc.user, doc.post, doc.time);
                    posts.push(post);
                });
                callback(null, posts);
            });
        });
    });
};

module.exports = exports = Post;
