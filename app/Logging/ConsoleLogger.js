
define(function() {
	
	var ConsoleLogger = function(ctx) {
		this.context = ctx;
	};

	ConsoleLogger.prototype.trace = function(msg) {
		window.console.log(this.context + ': ' + msg);
	};

	return ConsoleLogger;
});