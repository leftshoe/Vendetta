
var app = air.NativeApplication.nativeApplication;

// Create event handler for new window key combination
app.addEventListener("invoke", function(e) {
	var dir = e.currentDirectory;
	var file_paths = e.arguments;
	air.trace("invoke. dir: " + dir + " file_paths " + file_paths);

	// Pass application arguments in
	if(file_paths && file_paths.length > 0) {
		for(var i = 0; i < file_paths.length; i++) {
			var f = dir.resolvePath(file_paths[i]);
			//TODO: error handling here
			openWindow(f);
		}
	} else {
		
		// The current invisible window counts as open as well
		if(app.openedWindows.length == 1) {
			openWindow();
		}
	}
});

