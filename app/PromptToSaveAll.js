
define(["app/Logging/Log", "templates/PromptToSave.js"], function(Log) {
	var log = new Log('PromptToSaveAll');
	// Control-C on command line just calls closing repeatedly, so we
	// need to force quit in that case.
	var MAX_QUITS = 100; 
	
	var PromptToSaveAll = function(core, documentManager) {
		this.quitAttempts = 0;
		this.documentManager = documentManager;
		this.model = new Backbone.Model();
		this.view = new PromptToSaveAllView({
			model: this.model,
			core: core
		});
		
		window.nativeWindow.addEventListener(air.Event.CLOSING,
			_.bind(this.closing, this));
	};
	
	PromptToSaveAll.prototype.closing = function(e) {
		if(!this.model.get('forceQuit') 
		&& !this.documentManager.isSaved()
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
	
	var PromptToSaveAllView = Backbone.View.extend({
		tagName: "div",
		id: "prompt-save-all-dialog",
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
			$(this.el).html(template.promptToSaveAll());
			$('body').append(this.el);
			return this;
		},
		save: function() {
			this.core.trigger('saveall');
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
	
	return PromptToSaveAll;
});