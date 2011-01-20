
define(["app/Logging/Log", "templates/Notification.js"], function(Log) {
	var log = new Log('Notification');
	
	var Notification = Backbone.View.extend({
		tagName: 'div',
		className: 'notification',
		initialize: function(options) {
			this.msg = options.msg;
			this.render();
		},
		render: function() {
			var self = this;
			log.trace('render');
			$(self.el).html(template.notification({msg: this.msg}));
			$('body').append(self.el);
			$(self.el).slideDown('slow', function() {
				_.delay(function() {
					$(self.el).fadeOut('slow');	
				}, 1000);
			});
			return this;
		}
	});
	
	return Notification;
});