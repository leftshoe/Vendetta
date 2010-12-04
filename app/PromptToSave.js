
define(["app/Logging/Log", "templates/PromptToSave.js"], function(Log) {
	var log = new Log('PromptToSave');
	// Control-C on command line just calls closing repeatedly, so we
	// need to force quit in that case.
	var MAX_QUITS = 100; 
	
	var PromptToSave = function(core, editor) {
		this.quitAttempts = 0;
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
		if(!this.model.get('forceQuit') 
		&& !this.editor.isSaved()
		&& this.quitAttempts <= MAX_QUITS) {
			this.view.render();
			$(this.view.el).overlay(overlay_settings);
			$(this.view.el).data("overlay").load();
			this.quitAttempts += 1;
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
			"click .close-anyway": "close",
			"click .cancel": "cancel"
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
		},
		cancel: function() {
			$(this.el).data("overlay").close();
		}
	});
	
	return PromptToSave;
});