
define(["app/Logging/Log", "./File", "./Directory"], function(Log, File, Directory) {
	var log = new Log("DBFileSystem");
	var DB_SIZE = 2*1024*1024; //2MB
	
	var DBDirectory = Directory.extend({
		load: function() {
			log.trace('load');
			DBFileSystem.loadDirectory(this.get('fullFileName'), this);
		}
	});
	
	DBFileSystem = function() {
		var self = this;
		_.bindAll(self, 'loadDirectory', 'loadDefaultDirectory');
		
		if(window.openDatabase) {
			self.db = window.openDatabase("vendentta-file-db", "", "Vendetta File Database", DB_SIZE);
			self.initialise();
		} else {
			log.error("No window.openDatabase object");
		}
	};
	
	DBFileSystem.prototype.initialise = function() {
		this.db.transaction(function(t) {
			t.executeSql(
				'CREATE TABLE IF NOT EXISTS file (' + 
					'full_file_name VARCHAR,' + 
					'data VARCHAR' + 
				')');
		});
	};
	
	DBFileSystem.prototype.loadDefaultDirectory = function() {
		return this.loadDirectory('/');
	};
	
	DBFileSystem.prototype.loadDirectory = function(file_name, opt_directory) {
		log.trace('loadDirectory: ' + file_name);
		var directory = opt_directory || new DBDirectory({fullFileName: file_name});
				
		this.db.transaction(function(t) {
			t.executeSql('SELECT * FROM file WHERE full_file_name like ?', [file_name + '%'],
				function(t, rs) {
					for(var i = 1; i <= rs.rows.length; i++) {
						directory.addFile(new File({
							fullFileName: rs.rows.item(i).full_file_name
						}));
					}
				});
		});
		
		directory.set({loaded: true});
		return directory;
	};
	
	DBFileSystem.prototype.open = function(file_name, callback) {
		this.db.transaction(function(t) {
			t.executeSql('SELECT * FROM file WHERE full_file_name = ?', [file_name],
				function(t, rs) {
					var r = rs.rows.item(1);
					var f = new File({
						fullFileName: r.full_file_name,
						data: r.data
					});
					
					callback(f);
				});
		});
	};
	
	DBFileSystem.prototype.save = function(file) {
		this.db.transaction(function(t) {
			t.executeSql('INSERT OR REPLACE INTO file (full_file_name, data) VALUES (?, ?)',
						 [file.get('fullFileName'), file.get('data')]);
		});
	};
	
	DBFileSystem.prototype.saveas = function(data, callback) {
		var fileName = prompt("Save as");
		callback(new File({
			fullFileName: fileName,
			data: data
		}));
	}
	
	/*
	 * Opens from file system, only supported on nightly webkit
	 */ 
	DBFileSystem.prototype.openDialog = function(callback) {
		log.trace("Opening upload file dialog");
		var inputNode = $('<input />');
		inputNode.attr({
			type: "file"
		});
		inputNode.bind('change', function() { 
			log.trace('change event triggered');
			if(this.files && this.files.length > 0) {
				var file = this.files[0];
				var reader = new FileReader();
				reader.onload = function(e) {
					log.trace('onload triggered for file');
					callback(new File({
						fullFileName: file.name,
						data: e.target.result
					}));
				};
				
				log.trace('reading file ...');
				reader.readAsText(file);
			}
			inputNode.remove();
		});
		
		$('body').append(inputNode);
		inputNode.first().click();
	};
	
	return DBFileSystem;
})