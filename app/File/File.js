
define(["app/Logging/Log"], function(Log) {
	var log = new Log('File');
	
	var separator = isAir() ? air.File.separator : '/';

	var File = Backbone.Model.extend({
		initialize: function() {
			this.update();
			this.bind('change:fullFileName', this.update);
		}
	});
	
	File.prototype.update = function() {
		this.set({
			extension: this.extractExtension(),
			fileName: this.extractFileName(),
			directory: this.extractParentDir()
		});
	};
	
	// Just looks for the last bit after a dot that doesn't contain a path separator
	File.prototype.extractExtension = function() {
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
	
	File.prototype.extractFileName = function() {
		var parts = this.getFullFileName().split(separator);
		return _.last(parts);
	};
	
	File.prototype.extractParentDir = function() {
		var dir = this.getFullFileName().match('.*' + separator);
		return dir[0];
	}
	
	File.prototype.getFullFileName = function() {
		return this.get('fullFileName');
	};
	
	File.prototype.getFileName = function() {
		return this.get('fileName');
	};
	
	File.prototype.getExtension = function() {
		return this.get('extension');
	};	
	
	File.prototype.getDirectory = function() {
		return this.get('directory');
	};
	
	File.prototype.isDirectory = function() {
		return false;
	}

	return File;
});