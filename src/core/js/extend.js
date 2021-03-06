var extend = ( function(){
	var fnTest = /xyz/.test( function() { xyz; } ) ? /\b_super\b/ : /.*/;

	// Shared empty constructor function to aid in prototype-chain creation.
	var ctor = function(){};

	// Helper function to correctly set up the prototype chain, for subclasses.
	// Similar to `goog.inherits`, but uses a hash of prototype properties and
	// class properties to be extended.
	var inherits = function(parent, protoProps, staticProps) {
		var child;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		} else {
			child = function(){ parent.apply(this, arguments); };
		}

		// Inherit class (static) properties from parent.
		_.extend(child, parent);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();

		var _super = ctor.prototype;

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps){
			// Copy the properties over onto the new prototype
			for(var name in protoProps) {
				// Check if we're overwriting an existing function
				child.prototype[name] = typeof protoProps[name] == "function" && typeof _super[name] == "function" && fnTest.test(protoProps[name]) ? (function(name, fn) {
					return function() {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, protoProps[name]) : protoProps[name];
			}
		} //_.extend(child.prototype, protoProps);

		var _constructor_super = parent;

		// Add static properties to the constructor function, if supplied.
		if (staticProps){
			// Copy the properties over onto the new prototype
			for(var name in staticProps) {
				// Check if we're overwriting an existing function
				child[name] = typeof staticProps[name] == "function" && typeof _constructor_super[name] == "function" && fnTest.test(staticProps[name]) ? (function(name, fn) {
					return function() {
						var tmp = this._super;

						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _constructor_super[name];

						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);
						this._super = tmp;

						return ret;
					};
				})(name, staticProps[name]) : staticProps[name];
			}
		} // _.extend(child, staticProps);

		// Correctly set child's `prototype.constructor`.
		child.prototype.constructor = child;

		// Set a convenience property in case the parent's prototype is needed later.
		child.__super__ = parent.prototype;

		return child;
	};

	var extend = function (protoProps, classProps) {
		var child = inherits(this, protoProps, classProps);
		child.extend = this.extend;
		return child;
	}

	return function( fn ){
		fn.extend = extend;
		return fn;
	}

}() );
