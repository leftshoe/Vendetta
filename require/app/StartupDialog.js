
define(["app/Logging/Log", "templates/StartupDialog.js"], function(Log) {
	var log = new Log('StartupDialog');
	
	var StartupDialog = function(core) {
		var self = this;
		self.view = new StartupDialogView();
		
		if(isAir()) {
			var runBeforeFile = air.File.applicationStorageDirectory.resolvePath('runbefore');
			
			var hasRunBefore = runBeforeFile.exists;
			
			if(!hasRunBefore) {
				var fileStream = new air.FileStream();
				fileStream.openAsync(runBeforeFile, air.FileMode.WRITE);
				fileStream.close();
			}
		} else {
			var hasRunBefore = localStorage['hasRunBefore'];
			localStorage['hasRunBefore'] = true;
		}
		
		if(!hasRunBefore) {
			self.show();
			
			core.bind('togglemetamode', function() {
				$(self.view.el).data("overlay");
				$(self.view.el).data("overlay").close();
			});
		}
	};	
	
	StartupDialog.prototype.show = function() {
		this.view.render();
		$(this.view.el).overlay(overlay_settings);
	};
	
	var overlay_settings = {
		closeOnClick: true,
		load: true,
		speed: 0,
		mask: {
			color: '#ebecff',
			loadSpeed: 0,
			opacity: 0.8
		}
	};
	
	var StartupDialogView = Backbone.View.extend({
		tagName: "div",
		className: "startup-dialog",
		render: function() {
			$(this.el).html(template.startupDialog());
			$('body').append(this.el);
			return this;
		}
	});
	
	return StartupDialog;
});