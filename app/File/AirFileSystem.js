
define(["app/Logging/Log", "./File", "./Directory"], function(Log, File, Directory) {
	var log = new Log("AirFileSystem");
	var POLLING_INTERVAL = 8000;
	
	var AirDirectory = Directory.extend({
		load: function() {
			log.trace('load');
			AirFileSystem.loadDirectory(this.get('fullFileName'), this);
		}
	});
	
	var AirFile = File.extend({
		initialize: function() {
			_.bindAll(this, 'pollForChanges');
			File.prototype.initialize.call(this);
		},
		pollForChanges: function() {
			var airfile = new air.File(this.getFullFileName());
			
			if(airfile.exists && 
			   this.get('modificationDate').toString() != airfile.modificationDate.toString()) {
				this.trigger('changedOnFilesystem');
				this.set({modificationDate : airfile.modificationDate});
			}
			
			setTimeout(this.pollForChanges, POLLING_INTERVAL);
		}
	});
	
	var AirFileSystem = {};
	
	AirFileSystem.open = function(file_name, callback) {
		log.trace('opening ' + file_name);
		var airfile = new air.File(file_name);
		var fileStream = new air.FileStream();
		
		fileStream.addEventListener(air.Event.COMPLETE, function() {
			var str = fileStream.readMultiByte(fileStream.bytesAvailable, air.File.systemCharset);
			fileStream.close();
			var file = new AirFile({
				fullFileName: file_name,
				modificationDate: airfile.modificationDate,
				data: str
			});
			
			file.pollForChanges(); // start polling
			callback(file);
		});
		
		// Triggers COMPLETE event when open
		fileStream.openAsync(airfile, air.FileMode.READ);
	};
	
	AirFileSystem.isDirectory = function(file_name) {
		var f = new air.File(file_name);
		return f.isDirectory;
	};
	
	AirFileSystem.loadDirectory = function(file_name, opt_directory) {
		log.trace('loadDirectory: ' + file_name);
		var directory = opt_directory || new AirDirectory({fullFileName: file_name});
		
		var airdir = new air.File(file_name);
		assert(airdir.isDirectory);
		
		var airfiles = airdir.getDirectoryListing();
		_.each(airfiles, function(file) {
			var Type = file.isDirectory ? AirDirectory : File;
			directory.addFile(new Type({
				fullFileName: file.nativePath
			}));
		});
		
		directory.set({loaded: true});
		return directory;
	};
	
	AirFileSystem.loadDefaultDirectory = function() {
		return AirFileSystem.loadDirectory(air.File.documentsDirectory.nativePath);
	};
	
	AirFileSystem.openDirectoryDialog = function(callback) {
		var self = this;
		log.trace("Air openDirectoryDialog called");
		var airfile = new air.File();
		airfile.addEventListener(air.Event.SELECT, function(e) {
			log.trace("select directory: " + e.target.nativePath);
			var dir = self.loadDirectory(e.target.nativePath);
			callback(dir);
		});
		
		airfile.browseForDirectory("Open Directory");
	};
	
	AirFileSystem.save = function(file) {
		log.trace("Saving " + file.get('fullFileName'));
		var airfile = new air.File(file.get('fullFileName'));
		var fileStream = new air.FileStream();
		fileStream.openAsync(airfile, air.FileMode.WRITE);
		
		fileStream.addEventListener(air.Event.CLOSE, function(e) {
			log.trace("Close");
			file.set({modificationDate: airfile.modificationDate});
		});
		
		fileStream.writeMultiByte(file.getData(), air.File.systemCharset);		
		fileStream.close();
		 
	};
	
	AirFileSystem.saveas = function(data, callback) {
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
	
	AirFileSystem.openDialog = function(callback) {
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