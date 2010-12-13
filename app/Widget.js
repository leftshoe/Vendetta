
define(["app/Logging/Log"], function(Log) {
	var log = new Log('Widget');
	
	/**
	 * Widgets are the controls displayed on in metamode
	 * They have the following attributes:
	 *   x, y: top left hand corner
	 *   width, height,
	 *   location: Read Only. Location for widget. One of: left,right,top,bottom
	 */
	var Widget = Backbone.Model.extend({
		initialize: function() {
			_.bindAll(this, 'show', 'hide', 'changeRect', 'dock');
			log.trace('initializing widget ...');
			this.bind('change:top', this.changeRect);
			this.bind('change:left', this.changeRect);
			this.bind('change:width', this.changeRect);
			this.bind('change:height', this.changeRect);
		},
		show: function() {
			log.trace('Showing widget');
			$(this.view.el).show();
		},
		hide: function() {
			log.trace('Hiding widget');
			$(this.view.el).hide();
		},
		changeRect: function() {
			log.trace('change rect: ' + JSON.stringify(this));
			$(this.view.el).css({
				top: this.get('top'),
				left: this.get('left'),
				width: this.get('width'),
				height: this.get('height')
			});
		},
		getLocation: function() {
			return this.get('location');
		}
	});
	
	return Widget;
});