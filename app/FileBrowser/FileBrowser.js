
define(["app/Logging/Log", "app/Widget", "app/File/FileSystem", "templates/FileBrowser.js"], 
		function(Log, Widget, FileSystem) {

	var log = new Log('FileBrowser');
	
	var FileBrowser = Widget.extend({
		initialize: function(core) {
			//_.bindAll(this, 'showFolder');
			Widget.prototype.initialize.call(this);
			var self = this;
			self.view = new FileBrowserView({core: core});
			
			self.set({location: "left"});
			
			core.bind('showfolder', function(e) {
				log.trace('e.folder: ' + e.folder); 
				e.folder.set({open: true});
				self.showFolder(e.folder);
			});
		},
		showFolder: function(file) {
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
			this.core = options.core;
			this.folders = {};
			
			this.file = FileSystem.loadDefaultDirectory();
			this.file.set({open: true});
			this.updateLookup(this.file);
			
			this.render();
		},
		render: function() {
			var self = this;
			log.trace('render');
			
			if(self.file) {
				$(self.el).html(template.fileBrowser({file: self.file.toJSON()}));
			} else {
				log.trace('No file to render');
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
			self.$('.file').click(function() {
				self.core.trigger('open', {fileName: $(this).data('fullFileName')});
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