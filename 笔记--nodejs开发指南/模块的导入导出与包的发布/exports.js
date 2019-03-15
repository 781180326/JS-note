var a = function(){
	console.log(a);
}
//exports = a; //错误，无法获得

module.exports = a;
