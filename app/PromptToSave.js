
define(["app/Logging/Log", "templates/PromptToSave.js"], function(Log) {
	var log = new Log('PromptToSave');
	
	var PromptToSave = function(core, editor) {
		this.editor = editor;
		this.model = new Backbone.Model();
		this.view = new PromptToSaveView({
			model: this.model,
			core: core
		});
		
		window.nativeWindow.addEventListener(air.Event.CLOSING,
			_.bind(this.closing, this));
	};
	
	PromptToSave.prototype.closing = function(e) {
		if(this.model.get('forceQuit')
		|| !this.editor.isSaved()) {
			this.view.render();
			$(this.view.el).overlay(overlay_settings);
			$(this.view.el).data("overlay").load();
			e.preventDefault();
		}
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
			"click .close-anyway": "close"
		},
		initialize: function(options) {
			this.core = options.core;
		},
		render: function() {
			log.trace('Rendering');
			$(this.el).html(template.promptToSave());
			$('body').append(this.el);
			return this;
		},
		save: function() {
			this.core.trigger('save');
			window.close();
		},
		close: function() {
			this.model.set({forceQuit: true});
			window.close();
		}
	});
	
	return PromptToSave;
});