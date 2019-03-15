function Util(){ }

Util.prototype.inherits = function( constructor, superConstructor ){

    var obj = Object.creat( superConstructor );

    constructor.prototype = obj;

    obj.constructor = constructor;

    return constructor;
}
