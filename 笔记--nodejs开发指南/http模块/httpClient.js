var http = require('http');
var querystring = require('querystring');

var contents = querystring.stringify({
    name: 'bwhite',
    email: 'bwhite@qq.com',
    address: 'xust'
});

var options = {
    host: 'localhost',
    port: 3000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': contents.length
    }
};

var req = http.request( options, function(res){
    res.setEncoding('utf8'),
    res.on('data', function(data){
        data = querystring.parse(data);
        console.log(data);
    })
} );

req.write(contents);
req.end();


// var req2 = http.get({
//     host: 'localhost',
//     port: 3000,
//     path: '/search?query=byvoid',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//     }
// }, function(res){
//     res.setEncoding('utf8');
//     res.on('data', function(data){
//         console.log(data);
//     })
// });
