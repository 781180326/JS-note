
/*
 在javascript中模仿接口：
	接口：如果接口中某个方法没有被实现，则会产生一个错误，错误消息向用户提供三种信息： 类名、接口名、未被实现的方法名
	
	在javascript中模仿接口的三种方法：
		一、用注释描述接口
		二、用属性检查模仿接口
		三、用鸭式辨型模仿接口
	
	在javascript设计模式一书中使用的接口实现方法：第一种和第三种
	
	下面是此书中使用的Interface类与注释的实例：
*/
		
		
/**
 * Interface构造函数
 * @param {string} name   接口名
 * @param {array}  method 此接口应该实现的方法名数组
 */
var Interface = function(name, method){
	if(arguments.length != 2){
		throw new Error("Interface constructor called with " + arguments.length+" arguments, but expected exactiy 2.");
	}
	
	this.name = name;
	this.methods = method;
	for(var i = 0, len = method.length; i < len; i++ ){
		if(typeof method[i] !== "string"){
			throw new Error("Interface constructor expects method names to be passed in as a string");
		}
	}
};
 
/**
 * 判断“接口” 中定义的方法是否全部被传入的object对象实现
 * 此方法必须传入两个或两个以上的参数，第一个参数为接受接口的对象实例，后面的参数为需要对象实例实现的Interface接口对象
 * @param  {object} object 接受接口的对象实例
 */
Interface.ensureInplements = function(object){

	//参数必须多于一个
	if(arguments.length < 2){
		throw new Error("Function Interface.ensureImplements called with "+ayrguments.length + "arguments,but expected at least 2.");
	}
	
	for(var i = 1, len = arguments.length; i < len; i++){
		var interface = arguments[i];
		//参数必须是用Interface构造函数创建出来的
		if(interface.constructor !== Interface){
			throw new Error("Function Interface.ensureImplements expects arguments two and above to be instances of  Interface");
		}
		
		//循环判断objet中是否实现了传入的对象参数中的methodss值数组中的方法
		for(var j = 0, methodLen = interface.methods.length; j<methodLen; j++){
			var method = interface.methods[j];
			if(!object[method] || typeof object[method] !== "function"){
				throw new Error("Function Interface.ensureImplements:object does not implement the " + interface.name + "interface.Method" + method + was not fond);
			}
		}
	}
};


//实例：
	//Interface.  创建两个接口对象
	var Composite = new Interface("Composite",["add","remove","getChild"]),
		FormItem = new Interface("FormItem",["save"]);

	//CompositeForm  需要实现接口的类，用注释表明使用了 Composite 和 FormItem接口
	var  CompositeForm = function(id, method, action){
		//implements Composite,FormItem
		//...
	};

	//判断传入的formInstance对象是否实现了 Composite 和 FormItem “接口”,如果没有实现，会抛出异常
	function addForm(formInstance){
		Interface.ensureImplements(formInstance, Composite, FormItem);
		//...
	}

	addForm(new CompositeForm());