
define(["app/Logging/Log", "app/Widget", "app/Geometry/Rectangle"], function(Log, Widget, Rectangle) {
	var log = new Log('MetaMode');
	
	if(isAir()) {
		var Display = runtime.flash.display.StageDisplayState;
		var stage = window.nativeWindow.stage;
		
		log.trace("Screen height: " + stage.fullScreenHeight + " width: " + stage.fullScreenWidth);
	}
	
	var HORIZONTAL_SCALE = 0.6;
	var VERTICAL_SCALE = 0.8;
	var WIDGET_PADDING = 10; // in pixels
	
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
		self.widgetContainer = document.createElement('div');
		self.widgets = new (Backbone.Collection.extend({model: Widget}));
		
		core.set({inMetaMode: false});
		
		core.bind('togglemetamode', this.toggleMetaMode);
		core.bind('closemetamode', this.closeMetaMode);
		
		if(isAir()) {
			window.nativeWindow.addEventListener(air.Event.DEACTIVATE, function() {
				log.trace('deactivating');
				core.trigger('closemetamode');
			});
		}
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
		var widgetContainer = $(self.widgetContainer);
		var inMetaMode = self.core.get('inMetaMode');
		
		// Removing these first should minimize graphical artifacts
		if(!inMetaMode) {
			// without this pixel dimensions are lost when detached
			editor.css({
				width: editor.width(),
				height: editor.height()
			});
			
			editor.detach();
		} else {
			widgetContainer.detach();
		}
		
		// Give the browser time to re-render the blank page
		_.defer(function() {
			if(isAir()) {
				// This has to happen before positioning the widgets, see getScreen.
				stage.displayState = inMetaMode ?
					Display.NORMAL : Display.FULL_SCREEN_INTERACTIVE;
			}

			if(!inMetaMode) {
				log.trace('Entering metaMode');
				self.manageWidgets();
				self.manageEditor();
				self.core.trigger('enteredmetamode');
				editor.addClass('fullscreen');
			} else {
				log.trace('Exiting metaMode');
				self.resetEditor();
				editor.removeClass('fullscreen');
			}
		});
		
		self.editor.ace.focus();
		self.core.set({inMetaMode: !inMetaMode});
	};
	
	/* 
	 * The value returned by adobe air depends on if the application is 
	 * in full screen mode or not. When not fullscreen, the height is 
	 * short the height of the taskbar (on a mac).
	 */ 
	MetaMode.prototype.getScreen = function() {
		if(isAir()) {
			return {
				height: stage.fullScreenHeight,
				width: stage.fullScreenWidth
			};
		} else {
			return {
				height: window.innerHeight,
				width: window.innerWidth
			};
		}
	};
	
	MetaMode.prototype.addWidget = function(widget) {
		this.widgets.add(widget);
		$(this.widgetContainer).append(widget.getElement());
	};
	
	var toolBoxFilter = function(toolbox) {
		return toolbox ? 
			function(m) { return m.get('toolbox') == toolbox} : 
			_.identity;
	};
		
	var filterByLocation = function(loc) {
		return function(widget) {
			return widget.get('location') == loc;
		};
	};
	
	MetaMode.prototype.manageWidgets = function() {
		var self = this;
		
		var editorDimensions = self.shrinkEditor();		
		log.trace('editor dimensions after shrink: ' + JSON.stringify(editorDimensions));
		
		_.each(this.widgets.select(filterByLocation('left')), function(widget) {
			var rect = new Rectangle({
				top: 0, left: 0,
				width: editorDimensions.left,
				height: self.getScreen().height
			});
			widget.setRect(rect.shrink(WIDGET_PADDING));	
			log.trace('left widget: ' +  JSON.stringify(widget.get('rect')));
		});
		
		_.each(this.widgets.select(filterByLocation('right')), function(widget) {
			var rect = new Rectangle({
				top: 0,
				left: editorDimensions.left + editorDimensions.width,
				width: editorDimensions.left, //symmetrical against left widget
				height: self.getScreen().height
			});
			widget.setRect(rect.shrink(WIDGET_PADDING));
			log.trace('right widget: ' +  JSON.stringify(widget.get('rect')));
		});
		

	};
	
	MetaMode.prototype.manageEditor = function() {
		var self = this;
		var editor = $(self.editor.el);
		
		var screen = self.getScreen();
		$(self.widgetContainer).css({
			position: 'absolute',
			left: 0, top: 0,
			width: screen.width,
			height: screen.height
		});
		
		$(self.widgetContainer).append(editor);
		$('body').append(self.widgetContainer);
	};
	
	MetaMode.prototype.resetEditor = function() {
		var editor = $(this.editor.el);
		
		editor.detach();
		$('body').append(editor);
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
		
		var rect = new Rectangle({
			left: (screen.width - editorWidth) / 2,
			top: (screen.height - editorHeight) / 2,
			width: editorWidth,
			height: editorHeight
		});
		
		// Scaling is w.r.t the center of the editor,
		// and is applied post positioning and sizing.
		editor.css(rect);
		editor.css({
			'-webkit-transform': 'scale(' + scale + ')'
		});
		
		log.trace('editor dimensions before shrink: ' + JSON.stringify(rect));
		
		// Return dimensions as they appear on screen
		return rect.scale(scale);		
	};
	
	return MetaMode;
});