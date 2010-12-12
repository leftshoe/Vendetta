
define(["app/Logging/Log", "app/Widget", "templates/FileBrowser.js"], 
		function(Log, Widget) {

	var log = new Log('FileBrowser');
	
	var FileBrowser = Widget.extend({
		initialize: function(core) {
			var self = this;
			self.view = new FileBrowserView();
			
			core.bind('showfile', function(e) {
				e.file.set({open: true});
				self.showFile(e.file);
			});
		},
		showFile: function(file) {
			this.view.file = file;
			this.view.updateLookup(file);
			this.view.render();
		}
	});
	
	var FileBrowserView = Backbone.View.extend({
		tagName: 'div',
		className: 'file-browser',
		initialize: function(options) {
			this.rendered = false;
			this.folders = {};
			this.render();
		},
		render: function() {
			var self = this;
			log.trace('render');
			
			if(self.file) {
				$(self.el).html(template.fileBrowser({file: self.file.toJSON()}));
			} else {
				$(self.el).html('');
			}
			
			if(!self.rendered) {
				$('body').append(self.el);
			}
			
			self.updateHandlers();
			
			return this;
		},
		updateHandlers: function() {
			var self = this;
			self.$('.folder-name').click(function(){
				self.toggleFolder($(this).data('fullFileName'));
			});
		},
		toggleFolder: function(fullFileName) {
			log.trace('showing folder: ' + fullFileName);

			var dir = this.folders[fullFileName];
			
			if(dir.get('open')) {
				dir.set({open: false});
			} else {
				dir.set({open: true});
				this.updateLookup(dir);
			}
			
			this.render();
		},
		updateLookup: function(dir) {
			var self = this;
			self.folders[dir.getFullFileName()] = dir;
			
			dir.getFiles().each(function(f) {
				if(f.isDirectory()) {
					self.folders[f.getFullFileName()] = f;
				}
			});
		}
	});
	
	return FileBrowser;
});