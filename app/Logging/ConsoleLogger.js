
define(function() {
	
	var ConsoleLogger = function(ctx) {
		this.context = ctx;
	};

	ConsoleLogger.prototype.trace = function(msg) {
		window.console.log("TRACE " + this.context + ': ' + msg);
	};
	
	ConsoleLogger.prototype.error = function(msg) {
		window.console.log("ERROR " + this.context + ': ' + msg);
	};

	return ConsoleLogger;
});