
define(["app/Logging/Log", "app/Widget", "templates/FileBrowser.js"], 
		function(Log, Widget) {

	var log = new Log('FileBrowser');
	
	var FileBrowser = Widget.extend({
		initialize: function(core) {
			var self = this;
			self.view = new FileBrowserView();
			
			core.bind('showfile', function(e) {
				self.showFile(e.file);
			});
		},
		showFile: function(file) {
			this.view.file = file;
			this.view.render();
		}
	});
	
	var FileBrowserView = Backbone.View.extend({
		tagName: 'div',
		className: 'file-browser',
		initialize: function(options) {
			this.render();
		},
		render: function() {
			var self = this;
			log.trace('render');
			
			if(this.file) {
				log.trace("files: ");
				log.trace(JSON.stringify(this.file.toJSON()));
				$(self.el).html(template.fileBrowser({file: this.file.toJSON()}));
			} else {
				$(self.el).html('');
			}
			
			$('body').append(self.el);

			return this;
		}
	});
	
	return FileBrowser;
});