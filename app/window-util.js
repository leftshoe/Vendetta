
var DEFAULT_WINDOW_WIDTH = 700;
var DEFAULT_WINDOW_HEIGHT = 400;
var DEFAULT_POSITION_X = 200;
var DEFAULT_POSITION_Y = 200; 
var WOFFSET = 40; 

function openWindow(file_paths, existing_window) {
	var options = new air.NativeWindowInitOptions();
	options.resizable = true;
	options.maximizable = true;


	var x = existing_window ? existing_window.x + WOFFSET : DEFAULT_POSITION_X;
	if( x + DEFAULT_WINDOW_WIDTH > air.Capabilities.screenResolutionX) {
		x = WOFFSET;
	}
	
	var y = existing_window ? existing_window.y + WOFFSET : DEFAULT_POSITION_Y;
	if( y + DEFAULT_WINDOW_HEIGHT > air.Capabilities.screenResolutionY) {
		y = WOFFSET;
	}

	var windowBounds = new air.Rectangle(x, y, DEFAULT_WINDOW_WIDTH, DEFAULT_WINDOW_HEIGHT);
	// visible = false, scrollbars = false
	var loader = air.HTMLLoader.createRootWindow(false, options, false, windowBounds);
	loader.load(new air.URLRequest('vendetta.html'));
	
	// Ensure that on non-macs closing the last window closes the app
	if(!isMac()) {
		loader.window.nativeWindow.addEventListener(air.Event.CLOSE, function() {

			if(!_.any(air.NativeApplication.nativeApplication.openedWindows, function(win) {
				return win.visible;
			})) {
				air.NativeApplication.nativeApplication.exit();
			}
		});
	}
	
	loader.window.argFileNames = file_paths;
	loader.window.focus();
};