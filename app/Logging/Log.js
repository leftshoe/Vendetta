
define(["Logging/ConsoleLogger", "Logging/AirLogger"], function(ConsoleLogger, AirLogger) {
	return isAir() ? AirLogger : ConsoleLogger;
});