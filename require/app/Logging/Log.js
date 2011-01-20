
define(["./ConsoleLogger", "./AirLogger"], function(ConsoleLogger, AirLogger) {
	return isAir() ? AirLogger : ConsoleLogger;
});