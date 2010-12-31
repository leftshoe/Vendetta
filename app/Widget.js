
define(["app/Logging/Log", "app/Geometry/Rectangle"], function(Log, Rectangle) {
	var log = new Log('Widget');
	
	/**
	 * Widgets are the controls displayed in metamode
	 * They have the following attributes:
	 *   rect: In screen coordinates.
	 *   element: Root dom element for the widget.
	 *   location: Read Only. Location for widget. One of: left,right,top,bottom
	 *
	 *  Widgets are assumed to have a backbone style view as property 'view'.
	 */
	var Widget = Backbone.Model.extend({
		initialize: function() {
			_.bindAll(this, 'getElement', 'changeRect', 'setRect', 'getLocation', 'dock');
			log.trace('initializing widget ...');
			
			this.set({rect: new Rectangle()});
			this.bind('change:rect', this.changeRect);
		},
		getElement: function() {
			return this.view.el;
		},
		changeRect: function() {
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