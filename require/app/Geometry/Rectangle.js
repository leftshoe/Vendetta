
define([], function() {
	
	var Rectangle = function(settings) {
		_.bindAll(this, 'scale', 'shrink');
		if(settings) {
			this.left = settings.left || 0;
			this.top = settings.top || 0;
			this.width = settings.width || 0;
			this.height = settings.height || 0;
		}
	};
		// Rescales with center as origin
	Rectangle.prototype.scale = function(factor) {
		return new Rectangle({
			top: this.top + 0.5 * this.height * (1 - factor),
			left: this.left + 0.5 * this.width * (1 - factor),
			width: this.width * factor,
			height: this.height * factor
		});
	}
		// reduces rectangle by 'padding' on each side,
		// leaving the center fixed.
	Rectangle.prototype.shrink = function(padding) {
		return new Rectangle({
			top: this.top + padding,
			left: this.left + padding,
			width: this.width - 2 * padding,
			height: this.height - 2 * padding
		});
	};
	
	return Rectangle;
});