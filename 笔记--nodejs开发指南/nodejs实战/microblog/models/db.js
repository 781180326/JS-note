var settings = require('../settings');
var Db = require('mongodb').Db;         //mongodb数据库连接所需
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;

module.exports = exports = new Db( settings.db, new Server(settings.host, settings.port, {
    auto_reconnect: true,
    poolSize: 10
}) ); //第一个参数：数据库名、第二个参数：服务，包括地址和端口，还有一些配置、最终创建一个数据库连接
//new Db:新建数据库连接实例
//new Server: 新建数据库服务实例
