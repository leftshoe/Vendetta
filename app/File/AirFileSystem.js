
define(["app/Logging/Log", "./File"], function(Log, File) {
	var log = new Log("AirFileSystem");
	
	AirFileSystem = function() {
	};
	
	AirFileSystem.prototype.open = function(file_name, callback) {
		var airfile = new air.File(file_name);
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
		fileStream.openAsync(airfile, air.FileMode.READ);
	};
	
	AirFileSystem.prototype.save = function(file) {
		log.trace("Saving " + file.get('fullFileName'));
		var airfile = new air.File(file.get('fullFileName'));
		var fileStream = new air.FileStream();
		fileStream.openAsync(airfile, air.FileMode.WRITE);
		
		fileStream.writeMultiByte(file.get('data'), air.File.systemCharset);
		fileStream.close();
	};
	
	AirFileSystem.prototype.openDialog = function(callback) {
		var airfile = new air.File();
		airfile.addEventListener(air.Event.SELECT, function(e) {
			log.trace("select event called");
			callback(e.target.nativePath);
		});
		
		airfile.browseForOpen("Open");
	};
	
	return AirFileSystem;
})