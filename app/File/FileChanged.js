
define(["app/Logging/Log", 
		"app/OverlaySettings",
		"templates/FileChanged.js"], 
		function(Log, OverlaySettings) {

	var log = new Log('FileChanged');
	
	var FileChanged = function(core, doc) {
		this.view = new FileChangedView({
			doc: doc,
			core: core
		});
	};
	
	FileChanged.prototype.show = function() {
		this.view.render();
		$(this.view.el).overlay(OverlaySettings);
	};
	
	var FileChangedView = Backbone.View.extend({
		tagName: "div",
		className: "dialog file-changed-dialog",
		
		events: {
			"click .revert": "revert"
		},
		initialize: function(options) {
			this.core = options.core;
			this.doc = options.doc;
		},
		render: function() {
			$(this.el).html(template.fileChanged({
				fileName: this.doc.file.getFileName()
			}));
			$('body').append(this.el);
			return this;
		},
		revert: function() {
			this.core.trigger("revertdocument", {id: this.doc.id});
		}
	});
	
	return FileChanged;
});