
var DEFAULT_WINDOW_WIDTH = 602;
var DFAULT_WINDOW_HEIGHT = 322;
var DEFAULT_POSITION_X = 300;
var DEFAULT_POSITION_Y = 300; 

function openWindow(file_path) {
	var options = new air.NativeWindowInitOptions();
	options.resizable = true;
	options.maximizable = true;

	var windowBounds = new air.Rectangle(DEFAULT_POSITION_X, DEFAULT_POSITION_Y, 
										 DEFAULT_WINDOW_WIDTH, DFAULT_WINDOW_HEIGHT);
	// visible = false, scrollbars = false
	var loader = air.HTMLLoader.createRootWindow(false, options, false, windowBounds);
	loader.load(new air.URLRequest('vendetta.html'));
	
	loader.window.argFileName = file_path;
	loader.window.focus();
};