
define(["app/Logging/Log", "./File"], function(Log, File) {
	var log = new Log('Directory');
	
	/* Abstract, needs load method */
	var Directory = Backbone.Model.extend({
		initialize: function() {
			_.bindAll(this, 'getFiles', 'addFile', 'load');
			this.loaded = false;
			this.isDirectory = true;
			this.files = new Backbone.Collection();
		},
		getFiles: function() {
			if(this.loaded == false) {
				this.load();
			}
			
			return files;
		},
		addFile: function(f) {
			this.files.add(f);
		}
	});
	
	return Directory;
});