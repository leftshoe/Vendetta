
define(["app/Logging/Log", "app/Widget"], function(Log, Widget) {
	var log = new Log('MetaMode');
	
	if(isAir()) {
		var Display = runtime.flash.display.StageDisplayState;
		var stage = window.nativeWindow.stage;
	}
	
	var OFFSETS = {
		win: {x: 7, y: 29},
		mac: {x: 0, y: 20},
		linux: {x: 7, y: 29}
	};
	
	var MetaMode = function(core, editor) {
		_.bindAll(this, 'toggleMetaMode');
		var self = this;
		
		self.core = core;
		self.editor = editor;
		self.widgets = Backbone.Collection.extend({model: Widget});
		
		core.set({inMetaMode: false});
		
		core.bind('togglemetamode', this.toggleMetaMode);
	};
	
	var getOffset = function() {
		return OFFSETS[getOS()];
	};
	
	MetaMode.prototype.toggleMetaMode = function() {
		var self = this;
		var editor = $(self.editor.el);
		var inMetaMode = self.core.get('inMetaMode');
		
		if(!inMetaMode) {
			log.trace('Entering metaMode');
			
			editor.addClass('fullscreen');
			var offset = getOffset();
			editor.css({
				left: offset.x + stage.nativeWindow.x,
				top: offset.y + stage.nativeWindow.y,
				width: editor.width(),
				height: editor.height()
			});
		} else {
			log.trace('Exiting metaMode');
			
			editor.removeClass('fullscreen');
			editor.css({
				left: 0, top: 0,
				width: '100%', height: '100%'});
		}
		
		if(isAir()) {
			stage.displayState = inMetaMode ?
				Display.NORMAL : Display.FULL_SCREEN_INTERACTIVE;
		}
		
		self.core.set({inMetaMode: !inMetaMode});
	};
	
	var toolBoxFilter = function(toolbox) {
		return function(m) { return m.get('toolbox') == toolbox};
	};
	
	MetaMode.prototype.hideWidgets = function() {
		this.widgets.each(function(widget){
			widget.hide();
		});
	};
	
	MetaMode.prototype.showWidgets = function(toolbox) {
		var filter = toolBoxFilter(toolbox);
		this.widgets.select(filter).each(function(widget){
			widget.show();
		});
	};
	
	return MetaMode;
});