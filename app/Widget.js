
define(["app/Logging/Log"], function(Log) {
	var log = new Log('Widget');
	
	var Widget = Backbone.Model.extend({
		show: function() {
			log.trace('Showing widget');
		},
		hide: function() {
			log.trace('Hiding widget');
		}
	});
	
	return Widget;
});