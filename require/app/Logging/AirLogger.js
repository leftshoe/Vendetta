
define(function() {
	
	var AirLogger = function(ctx) {
		this.context = ctx;
	};

	AirLogger.prototype.trace = function(msg) {
		air.trace("TRACE " + this.context + ': ' + msg);
	};
	
	AirLogger.prototype.error = function(msg) {
		air.trace("ERROR " + this.context + ': ' + msg);
	};

	return AirLogger;
});