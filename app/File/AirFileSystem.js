
define(["Logging/Log", "File/File"], function(Log, File) {
	var log = new Log("AirFileSystem");
	
	AirFileSystem = function() {
	};
	
	AirFileSystem.prototype.open = function(file_name, callback) {
		var file = new air.File(file_name);
		var fileStream = new air.FileStream();
		
		fileStream.addEventListener(air.Event.COMPLETE, function() {
			var str = fileStream.readMultiByte(fileStream.bytesAvailable, air.File.systemCharset);
			fileStream.close();
			callback(new File({
				fullFileName: file_name,
				data: str
			}));
		});
		
		// Triggers COMPLETE event when open
		fileStream.openAsync(file, air.FileMode.READ);
	};
	
	AirFileSystem.prototype.save = function(file) {
		var file = new air.File(file.fullFileName);
		var fileStream = new air.FileStream();
		fileStream.openAsync(file, air.FileMode.WRITE);
		
		fileStream.writeMultiByte(file.data, air.File.systemCharset);
		fileStream.close();
	};
	
	AirFileSystem.prototype.openDialog = function(callback) {
		var file = new air.File();
		file.addEventListener(air.Event.SELECT, function(e) {
			callback(e.target.nativePath);
		});
		
		file.browseForOpen("Open");
	};
	
	return AirFileSystem;
})