
define(["app/Logging/Log", "app/Widget"], function(Log, Widget) {
	var log = new Log('MetaMode');
	
	if(isAir()) {
		var Display = runtime.flash.display.StageDisplayState;
		var stage = window.nativeWindow.stage;
	}
	
	var HORIZONTAL_SCALE = 0.6;
	var VERTICAL_SCALE = 0.8;
	
	var OFFSETS = {
		win: {x: 7, y: 29},
		mac: {x: -1, y: 21},
		linux: {x: 7, y: 29}
	};
	
	var MetaMode = function(core, editor) {
		_.bindAll(this, 'toggleMetaMode', 'addWidget', 'closeMetaMode');
		var self = this;
		
		self.core = core;
		self.editor = editor;
		self.widgets = new (Backbone.Collection.extend({model: Widget}));
		
		core.set({inMetaMode: false});
		
		core.bind('togglemetamode', this.toggleMetaMode);
		core.bind('closemetamode', this.closeMetaMode);
	};
	
	var getOffset = function() {
		return OFFSETS[getOS()];
	};
	
	MetaMode.prototype.closeMetaMode = function() {
		var inMetaMode = this.core.get('inMetaMode');
		if(inMetaMode) {
			this.toggleMetaMode();
		}
	}
	
	MetaMode.prototype.toggleMetaMode = function() {
		var self = this;
		var editor = $(self.editor.el);
		var inMetaMode = self.core.get('inMetaMode');
		
		if(isAir()) {
			stage.displayState = inMetaMode ?
				Display.NORMAL : Display.FULL_SCREEN_INTERACTIVE;
		}
		
		if(!inMetaMode) {
			log.trace('Entering metaMode');
			
			self.manageWidgets();
			self.showWidgets();
			
			editor.addClass('fullscreen');
		} else {
			log.trace('Exiting metaMode');
			
			self.resetWidgets();
			self.hideWidgets();
			
			editor.removeClass('fullscreen');
			editor.focus();
		}
				
		self.core.set({inMetaMode: !inMetaMode});
	};
	
	MetaMode.prototype.getScreen = function() {
		if(isAir()) {
			return {
				height: stage.fullScreenHeight,
				width: stage.fullScreenWidth
			};
		} else {
			return {
				height: window.height,
				width: window.width
			};
		}
	};
	
	var toolBoxFilter = function(toolbox) {
		return toolbox ? 
			function(m) { return m.get('toolbox') == toolbox} : 
			_.identity;
	};
	
	MetaMode.prototype.hideWidgets = function() {
		this.widgets.each(function(widget){
			widget.hide();
		});
	};
	
	MetaMode.prototype.showWidgets = function(toolbox) {
		var filter = toolBoxFilter(toolbox);
		_.each(this.widgets.select(filter), function(widget){
			widget.show();
		});
	};
	
	MetaMode.prototype.addWidget = function(widget) {
		this.widgets.add(widget);
	};
	
	var filterByLocation = function(loc) {
		return function(widget) {
			return widget.get('location') == loc;
		};
	};
	
	MetaMode.prototype.manageWidgets = function() {
		var self = this;
		var editor = $(self.editor.el);
		
		//TODO: position and size widgets
		var editorDimensions = self.shrinkEditor();
		
		_.each(this.widgets.select(filterByLocation('left')), function(widget) {
			log.trace('managing left widget: ' + JSON.stringify(widget));
			widget.set({
				top: 0, left: 0,
				width: editorDimensions.left,
				height: self.getScreen().height
			});	
		});
		
		_.each(this.widgets.select(filterByLocation('right')), function(widget) {
			log.trace('managing right widget ...');
			widget.set({
				top: 0,
				left: editorDimensions.left + editorDimensions.height,
				width: editorDimensions.left, //symmetrical
				height: self.getScreen().height
			});	
		});
	};
	
	MetaMode.prototype.resetWidgets = function() {
		var self = this;
		var editor = $(self.editor.el);
		editor.css({
			left: 0, top: 0,
			width: '100%',
			height: '100%',
			'-webkit-transform': 'scale(1)'
		});
	};
	
	MetaMode.prototype.shrinkEditor = function() {
		var self = this;
		var editor = $(self.editor.el);
		var screen = self.getScreen();
		var editorWidth = editor.width();
		var editorHeight = editor.height();
		var scale = 1;
		
		var hoz_factor = editorWidth / screen.width;
		if(hoz_factor > HORIZONTAL_SCALE) {
			scale = HORIZONTAL_SCALE / hoz_factor;
		}
		
		var vert_factor = editorHeight / screen.height;
		if(vert_factor > VERTICAL_SCALE) {
			scale = Math.min(scale, VERTICAL_SCALE / vert_factor);
		}
		
		// Scaling is w.r.t the center of the editor,
		// and is applied post positioning and sizing.
		editor.css({
			left: (screen.width - editorWidth) / 2,
			top: (screen.height - editorHeight) / 2,
			width: editorWidth,
			height: editorHeight,
			'-webkit-transform': 'scale(' + scale + ')'
		});
		
		// Return dimensions as they appear on screen
		return {
			left: (screen.width - scale*editorWidth) / 2,
			top: (screen.height - scale*editorHeight) / 2,
			width: scale*editorWidth,
			height: scale*editorHeight
		};
		
	};
	
	return MetaMode;
});