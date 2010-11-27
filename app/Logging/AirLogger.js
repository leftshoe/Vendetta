
define(function() {
	
	var AirLogger = function(ctx) {
		this.context = ctx;
	};

	AirLogger.prototype.trace = function(msg) {
		air.trace(this.context + ': ' + msg);
	};

	return AirLogger;
});