
var app = air.NativeApplication.nativeApplication;

// Create event handler for new window key combination
app.addEventListener("invoke", function(e) {
	var dir = e.currentDirectory;
	var file_paths = e.arguments;
	air.trace("invoke. dir: " + dir.nativePath + " file_paths: " + file_paths);

	if(file_paths && file_paths.length > 0) {
		
		// Resolve paths w.r.t the current directory
		full_paths = [];
		for(var i = 0; i < file_paths.length; i++) {
			var f = dir.resolvePath(file_paths[i]);
			full_paths.push(f.nativePath);
		}
		
		openWindow(full_paths);
	} else {
		
		// The current invisible window counts as open as well
		if(app.openedWindows.length == 1) {
			openWindow();
		} else {
			air.trace('open window count: ' + app.openedWindows.length);
		}
	}
});