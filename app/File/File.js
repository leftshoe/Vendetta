
define(function() {

	var File = Backbone.Model.extend({
	});
	
	File.prototype.getExtension = function() {
		var parts = this.get('fullFileName').split('.');
		return parts.length <= 1 ? null : _.last(parts);
	};

	return File;
});