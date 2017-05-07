//taken from https://www.youtube.com/watch?v=tux1DQ4Sp3A on 25/04/17
( function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

this.Class = function(){};

Class.extend = function(prop) {
	var _super = this.prototype;

	initializing = true;
	var prototype = new this();
	initializing = false;

	for(var name in prop) {
		prototype[name] = typeof prop[name] == "function" &&
		 typeof _super[name] == "function" && fnTest.test(prop[name]) ?
		 (function(name, fn)
		 	{ return function() {
		 		var tmp = this._super;

		 		this._super = _super[name]; 

		 		var ret = fn.apply(this, arguments);

		 		this._super = tmp;

		 		return ret;
		 	};
		 })(name, prop[name]) :
		 prop[name];
	}
function Class()
{
	if(!initializing && this.init)
		this.init.apply(this, arguments);
}

// Populate out constructed Prototye Object
Class.prototype = prototype;

Class.prototype.constructor = Class;

Class.extend = arguments.callee;

return Class;
};
})();