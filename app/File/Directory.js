
define(["app/Logging/Log", "./File"], function(Log, File) {
	var log = new Log('Directory');
	
	/* Abstract, needs load method */
	var Directory = Backbone.Model.extend({
		initialize: function() {
			_.bindAll(this, 'getFiles', 'addFile', 'load');
			this.set({
				files: new Backbone.Collection(),
				isDirectory: true,
				loaded: false,
				open: false
			});
		},
		getFiles: function() {
			if(!this.get('loaded')) {
				this.load();
			}
			
			return this.get('files');
		},
		addFile: function(f) {
			this.get('files').add(f);
		}
	});
	
	return Directory;
});