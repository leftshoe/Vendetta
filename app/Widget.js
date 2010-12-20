
define(["app/Logging/Log", "app/Geometry/Rectangle"], function(Log, Rectangle) {
	var log = new Log('Widget');
	
	/**
	 * Widgets are the controls displayed on in metamode
	 * They have the following attributes:
	 *   rect: In screen coordinates.
	 *   location: Read Only. Location for widget. One of: left,right,top,bottom
	 */
	var Widget = Backbone.Model.extend({
		initialize: function() {
			_.bindAll(this, 'show', 'hide', 'changeRect', 'setRect', 'dock');
			log.trace('initializing widget ...');
			this.set({rect: new Rectangle()});
			this.bind('change:rect', this.changeRect);
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
			//log.trace('change rect: ' + JSON.stringify(this));
			$(this.view.el).css(this.get('rect'));
		},
		setRect: function(rectangle) {
			this.set({rect: rectangle});
			return this;
		},
		getLocation: function() {
			return this.get('location');
		}
	});
	
	return Widget;
});