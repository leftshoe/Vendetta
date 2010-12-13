
define(["app/Logging/Log", "app/Widget"], function(Log, Widget) {
	var log = new Log('MetaMode');
	
	var HORIZONTAL_SCALE = 0.6;
	var VERTICAL_SCALE = 0.8;
	
	if(isAir()) {
		var Display = runtime.flash.display.StageDisplayState;
		var stage = window.nativeWindow.stage;
		var screenHeight = stage.fullScreenHeight;
		var screenWidth = stage.fullScreenWidth;
	} else {
		var screenHeight = window.height;
		var screenWidth = window.width;
	}
	
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
		
		if(isAir()) {
			stage.displayState = inMetaMode ?
				Display.NORMAL : Display.FULL_SCREEN_INTERACTIVE;
		}
		
		self.core.set({inMetaMode: !inMetaMode});
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
				height: screenHeight
			});	
		});
		
		_.each(this.widgets.select(filterByLocation('right')), function(widget) {
			log.trace('managing right widget ...');
			widget.set({
				top: 0,
				left: editorDimensions.left + editorDimensions.height,
				width: editorDimensions.left, //symmetrical
				height: screenHeight
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
		var editorWidth = editor.width();
		var editorHeight = editor.height();
		var scale = 1;
		
		var hoz_factor = editorWidth / screenWidth;
		if(hoz_factor > HORIZONTAL_SCALE) {
			scale = HORIZONTAL_SCALE / hoz_factor;
		}
		
		var vert_factor = editorHeight / screenHeight;
		if(vert_factor > VERTICAL_SCALE) {
			scale = Math.min(scale, VERTICAL_SCALE / vert_factor);
		}
		
		var editorDimensions = {
			left: (screenWidth - editorWidth) / 2,
			top: (screenHeight - editorHeight) / 2,
			width: editorWidth,
			height: editorHeight
		}
		editor.css(_.extend(editorDimensions, {
			'-webkit-transform': 'scale(' + scale + ')'
		}));
		
		return editorDimensions;
	};
	
	return MetaMode;
});