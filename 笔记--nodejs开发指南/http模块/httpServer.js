var http = require('http');
var url = require('url');
var util = require('util');
var querystring = require('querystring');



// http.createServer( function( req, res ){
//     res.writeHead(200, {'Content-type': 'text/html'});
//     res.write('<h1>node.js</h1>');
//     res.write('<p>hello world</p>');
//     res.end(util.inspect(url.parse(req.url, true)));
//     // Url { protocol: null,
//     // slashes: null,
//     // auth: null,
//     // host: null,
//     // port: null,
//     // hostname: null,
//     // hash: null,
//     // search: '?a=b&b=a',
//     // query: { a: 'b', b: 'a' },
//     // pathname: '/sadsad/aa',
//     // path: '/sadsad/aa?a=b&b=a',
//     // href: '/sadsad/aa?a=b&b=a' }
//
//     //res.end(req.url);//sadsad/aa?a=b,b=a
// } ).listen(4000);

http.createServer(function(req, res){
    var method = req.method;
    if(method == 'GET'){
        var query = util.inspect(url.parse(req.url, true).query);
        res.end(query);
    }
    if(method == 'POST'){
        var data = '';
        req.on('data', function(chunk){
            data += chunk;
        });
        req.on('end', function(){
            res.write(data);
            res.end();
        });
    }
}).listen(3000);
console.log('http server is listening at port 3000');
