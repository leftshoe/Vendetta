
define(["app/Logging/Log", "templates/PromptToSave.js"], function(Log) {
	var log = new Log('PromptToSave');
	
	var PromptToSave = function(core, docId) {
		this.quitAttempts = 0;
		this.view = new PromptToSaveView({
			docId: docId,
			core: core
		});
	};
	
	PromptToSave.prototype.show = function() {
		this.view.render();
		$(this.view.el).overlay(overlay_settings);
		//$(this.view.el).data("overlay").load();
	};
	
	var overlay_settings = {
		closeOnClick: false,
		load: true,
		mask: {
			color: '#ebecff',
			loadSpeed: 200,
			opacity: 0.8
		}
	};
	
	var PromptToSaveView = Backbone.View.extend({
		tagName: "div",
		id: "prompt-save-dialog",
		className: "dialog",
		
		events: {
			"click .save": "save",
			"click .close-anyway": "close",
			"click .cancel": "cancel"
		},
		initialize: function(options) {
			this.core = options.core;
			this.docId = options.docId;
		},
		render: function() {
			log.trace('Rendering');
			$(this.el).html(template.promptToSave());
			$('body').append(this.el);
			return this;
		},
		save: function() {
			this.core.trigger('savedocument', {id: this.docId});
			this.close();
		},
		close: function() {
			this.core.trigger("closedocument", {id: this.docId});
			$(this.el).data("overlay").close();
		},
		cancel: function() {
			$(this.el).data("overlay").close();
		}
	});
	
	return PromptToSave;
});