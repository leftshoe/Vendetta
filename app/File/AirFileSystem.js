
define(["app/Logging/Log", "./File"], function(Log, File) {
	var log = new Log("AirFileSystem");
	
	AirFileSystem = function() {
	};
	
	AirFileSystem.prototype.open = function(file_name, callback) {
		log.trace('opening ' + file_name);
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
	
	AirFileSystem.prototype.saveas = function(data, callback) {
		var self = this;
		var docs_dir = air.File.documentsDirectory;
		try {
			docs_dir.addEventListener(air.Event.SELECT, function(e) {
				var f = new File({
					fullFileName: e.target.nativePath,
					data: data
				});
				self.save(f)
				callback(f);
			});
			docs_dir.browseForSave("Save as");
		} catch (error) {
			log.error("Error in saveas: " + error.message);
		}
	};
	
	AirFileSystem.prototype.openDialog = function(callback) {
		var self = this;
		log.trace("Air openDialog called");
		var airfile = new air.File();
		airfile.addEventListener(air.Event.SELECT, function(e) {
			log.trace("select event called");
			self.open(e.target.nativePath, callback);
		});
		
		airfile.browseForOpen("Open");
	};
	
	return AirFileSystem;
})