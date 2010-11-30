
define(function() {

	var separator = isAir() ? air.File.separator : '/';

	var File = Backbone.Model.extend({
	});
	
	// Just looks for the last bit after a dot that doesn't contain a path separator
	File.prototype.getExtension = function() {
		var parts = this.getFullFileName().split('.');
		if(parts.length > 1) {
			var ext = _.last(parts);
			if(ext && ext.match(separator)) {
				return null;
			} else {
				return ext;
			}
		} else {
			return null;
		}
	};
	
	File.prototype.getFileName = function() {
		var parts = this.getFullFileName().split(separator);
		return _.last(parts);
	};
	
	File.prototype.getFullFileName = function() {
		return this.get('fullFileName');
	}

	return File;
});