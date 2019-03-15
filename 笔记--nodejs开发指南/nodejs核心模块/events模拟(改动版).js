

function EventEmitter() {
    this.handers = [];
}
EventEmitter.prototype.on = function( eventName, hander ){
    if( !(eventName in this.handers) || !this.handers[eventName] ){
        this.handers[eventName] = [];
    }

    this.handers[eventName].push(hander);
    return this;
};
EventEmitter.prototype.emit = function(eventName) {
    let handers = this.handers[eventName];
    if( !handers ) return this;
    let args = Array.prototype.slice.call( arguments, 1 );
    let popIndex = [];

    handers.forEach( function( hander ){
        hander.apply( this, args);
        if(hander.once == true){
            hander.once == null;
            popIndex.push(handers.indexOf(hander));
        }
    } );

    popIndex.reverse().forEach(function(index){
        handers.splice(index, 1);
    });

    return this;
};

EventEmitter.prototype.once =  function( eventName, hander ){
    hander.once = true;
    // if( !(eventName in this.handers) )  this.handers[eventName] = [];

    // this.handers[eventName].push(hander);
    this.handers[eventName] = [hander];
    return this;
};

EventEmitter.prototype.remove = function( eventName, hander ){
      let handers = this.handers[eventName];
      if( !handers ) { return this; }
    	//let index = handers.indexOf(hander);
        //if( index != -1 ) return handers.splice(index, 1);
        
      let index = -1;
      while( (index = handers.indexOf(hander)) != -1 ){
        	handers.splice(index, 1);
      }
      if( !handers )    handers = null;
      return this;
}


// 新建一个emitter对象
var emitter = new EventEmitter()
var log = console.log
// 注册事件
emitter.on('someTask', log)
// 触发事件
emitter.emit('someTask', 1, 2) // 1 2
// 注册once事件
emitter.once('onceTask', log)
// 触发事件
emitter.emit('onceTask', 1) // 1
// 触发事件
emitter.emit('onceTask', 1) // 不输出
// 移除监听函数
emitter.remove('someTask', log)
// 触发事件
emitter.emit('someTask', 1) // 不输出
