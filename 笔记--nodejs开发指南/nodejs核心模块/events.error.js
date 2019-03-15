var events = require('events');
var emitter = new events.EventEmitter();
emitter.on('error', function(){
    // process.stdout.write('哎呀，出错啦\n');
    console.log('哎呀，出错啦');
});
emitter.emit('error');
