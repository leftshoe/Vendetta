
define(["app/Logging/Log", "./File"], function(Log, File) {
	var log = new Log('Directory');
	
	/* Abstract, needs load method */
	var Directory = Backbone.Model.extend({
		initialize: function() {
			var self = this;
			_.bindAll(self, 'getFiles', 'addFile', 'load');
			self.set({
				files: new Backbone.Collection(),
				isDirectory: true,
				loaded: false,
				open: false,
			});
			
			self.update();
			self.bind('change:fullFileName', self.update);
		},
		update: function() {
			var fullFileName = this.getFullFileName();
			
			// Remove trailing slash
			if(fullFileName.match('.' + File.separator + '$')) {
				fullFileName = fullFileName.substr(0, fullFileName.length-1);
				this.set({fullFileName: fullFileName});
			}
			
			var parts = fullFileName.split(File.separator);
			//log.trace('fullFileName: ' + fullFileName);
			//log.trace('last: ' + _.last(parts));
			this.set({
				fileName: _.last(parts) || File.separator,
				directory: fullFileName,
				hidden: _.last(parts).substr(0,1) == '.'
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
		},
		getDirectory: function() {
			return this.get('directory');
		},
		getFullFileName: function() {
			return this.get('fullFileName');
		},
		getExtension: function() {
			return null;
		},
		getFileName: function() {
			return this.get('fileName');
		},
		isDirectory: function() {
			return true;
		},
		toJSON: function() {
			var json = _.clone(this.attributes);
			json.files = this.get('files').toJSON();
			return json;
		}
	});
	
	return Directory;
});