let events = function(){
    this.handers = [];
}
events.prototype.on = function( eventName, hander ){
    //不仅事件名要在里面，而且事件名的值不能为null
    if( !(eventName in this.handers) || !this.handers[eventName] ){
        this.handers[eventName] = [];
    }

    this.handers[eventName].push(hander);
    return this;
};
events.prototype.emit = function(eventName) {
    let handers = this.handers[eventName];
    if( !handers ) return this;
    let args = Array.prototype.slice.call( arguments, 1 );
    let popIndex = [];

    //将once为true的方法的索引放在popIndex中，最后删除
    //为啥不直接删除？ forEach的原理其实和for in 循环是一样的，i一直++，所以，当你删除一个元素时，如果想要循环过程继续下去，就需要让 for in 的那个 i 减去 1，但是forEach并不能手动减去一个长度，所以需要存储起来，最后再想办法删除
    handers.forEach( function( hander ){
        hander.call( this, args);
        if(hander.once == true){
            hander.once == null;
            popIndex.push(handers.indexOf(hander));
        }
    } );

    //原本的索引数组是正向，也就是从小到大的，现在将索引数组反向，从大到小取值，就不会对后面的索引位置造成影响
    popIndex.reverse().forEach(function(index){
        handers.splice(index, 1);
    });
    //或者：
    // for (let index of popIndex.reverse()) {
    //     handers.splice(index, 1);
    // }

    return this;
};

events.prototype.once =  function( eventName, hander ){
    hander.once = true;
    if( !(eventName in this.handers) )  this.handers[eventName] = [];

    this.handers[eventName].push(hander);
    return this;
};

events.prototype.removeListener = function( eventName, hander ){
    let handers = this.handers[eventName];
    if( !handers ) { return this; }

    let index = handers.indexOf(hander);
    if( index != -1 ) return handers.splice(index, 1);
    if( !handers )    handers = null;
    return this;
}

events.prototype.removeAllListeners = function( eventName ){
    eventName ? this.handers[eventName] = null : this.handers = [];
    return this;
}


let event = new events();

let hander1 = (data) => console.log('hander1' + data);
let hander2 = (data) => console.log('hander2' + data);
let hander3 = (data) => console.log('hander3' + data);

let once1 = () => console.log('once1');
let once2 = () => console.log('once2');
let once3 = () => console.log('once3');

// event.removeAllListeners('hander');
event.on( 'hander', hander1 );
event.on( 'hander', hander2 );
event.on( 'hander', hander3 );
// event.removeAllListeners('hander');
event.once( 'once', once1 );
event.once( 'once', once2 );
event.once( 'once', once3 );

event.emit('hander', 'this is hander');
event.emit('hander', 'this is hander');
event.emit('once');
event.emit('once');

event.removeListener('hander', hander1);
event.emit('hander', 'this is hander');
event.emit('once');

event.removeAllListeners('hander');
event.emit('hander', 'this is hander');
