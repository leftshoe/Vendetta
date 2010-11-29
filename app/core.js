
define([], function() {

	var Core = function () {
		// Allow events to be bound and triggered on instances of this class
		_.extend(this, Backbone.Events);
	};

	return Core;
});