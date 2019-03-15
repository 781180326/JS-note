let fs = require('fs');

//异步读取
// fs.readFile('../file.txt', 'utf-8', function(err, data) {
// 	if(err) console.log(err);
// 	else console.log(data);
// });
// hello, this is a tx
//
// fs.readFile('../file.txt',  function(err, data) {
// 	if(err) console.log(err);
// 	else console.log(data);
// });
// //<Buffer 68 65 6c 6c 6f 2c 20 74 68 69 73 20 69 73 20 61 20 74 78 74 0a>


//同步读取
// try {
// 	let data = fs.readFileSync('../file.txt', 'utf-8');
// } catch (e) {
// 	console.log(e);
// 	console.log(data);
// }

//open and read
// fs.open('../../pictire', 'w+', '0775', (err, fd)=>{
//     var buffer = new Buffer.alloc(8);
//     //由于安全性和可用性问题，Buffer被弃用。请使用Buffer.alloc。
//     fs.read( fd, buffer, 0, 8, null,(err, bytesRead, buffer)=>{
//         if (err) {
//             console.error(err);
//         }
//         console.log(bytesRead);
//         console.log(buffer);;
//     } )
// });
//
// open and write
// fs.open('../../pictire', 'w+', (err, fd)=>{
//     var buffer = new Buffer.alloc(8);
//     buffer.write('abcdefgh',0,8,'utf-8');
//     //由于安全性和可用性问题，Buffer被弃用。请使用Buffer.alloc。
//     fs.write(fd, buffer, 0, 8, null,(err, bytesWrite, buffer)=>{
//         if (err) {
//             console.error(err);
//         }
//         console.log(bytesWrite);
//         console.log(buffer);;
//     } )
// });




// (1) 异步读取文件内容 fs.readFile(filename,[encoding],[callback(err, data)])

// (2) 异步写入文件内容
// fs.writeFile('../../pictiresdas.txt', 'this is write data', 'utf-8', (err)=>console.error(err));

//异步追加文件内容
// fs.appendFile('../../pictireergrerh.txt', 'this is write data', 'utf-8', (err)=>console.error(err));
// (3) 异步删除文件
// fs.unlink( '../../pictire', (err)=>console.error(err) )


// (4) 异步创建目录
// fs.mkdir( '../../pictires', '0777', (err)=>console.error(err) );
// //
// // (5) 异步删除目录
// // fs.rmdir('../../pictires', (err)=>console.error(err) )
// //
// // (6) 异步读取目录
// fs.readdir( '../../node-dome', (err, files) => console.log(files) )
// //
// // (7) 异步获取真实路径
// // fs.realpath( path, [callback(err, resolvedPath)] )
// //
// // (8) 异步更名
// fs.rename( '../../pictires', '../../pictire',  (err)=>console.error(err) )
//
// (9) 异步截断
// fs.truncate( fd, len, [callback(err)] )
//
// (10)异步更改所有权
// fs.chown( path, uid, gid, [callback(err)])   //u:所有者 g：同组其他人
//
// (11)异步更改权限
// fs.chmod( path, mode, [callback(err)] )
//
// (12)异步修改文件时间戳
// fs.utimes( path, atime, mtime, [callback(err)] )
//
// (13)异步同步磁盘缓存
// fs.fsync( fd, [callback(err)] )
// (14)异步判断文件夹是否存在
// fs.exists( '../../pictire',(exists)=> exists ? console.log('文件夹已存在'):null);
//
// (15)异步显示文件的详细信息，针对详细信息判断是文件夹还是文件
// fs.stat( '../../pictire', (err, data)=>{
//     if (err) {
//         console.error(err);
//     }
//
//     console.log(data);
//     var res = data.isFile();
//     if (res) {
//         console.log(' is file');
//     }else {
//         console.log(' is directory');
//     }
// } )
