
define(["app/Logging/Log"], function(Log) {
	var log = new Log('Widget');
	
	var Widget = Backbone.Model.extend({
		initialize: function() {
			_.bindAll(this, 'show', 'hide', 'changePosition');
			this.bind('change:position', changePosition);
		},
		show: function() {
			log.trace('Showing widget');
			$(this.view.el).show();
		},
		hide: function() {
			log.trace('Hiding widget');
			$(this.view.el).hide();
		},
		changePosition: function() {
			$(this.view.el).css({
				top: this.get('y'),
				left: this.get('x')
			});
		}
	});
	
	return Widget;
});