
define(["Logging/Log", "File/File"], function(Log, File) {
	var log = new Log("DBFileSystem");
	var DB_SIZE = 2*1024*1024; //2MB
	
	DBFileSystem = function() {
		if(window.openDatabase) {
			this.db = window.openDatabase("vendentta-file-db", "", "Vendetta File Database", DB_SIZE);
			this.initialise();
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
			t.executeSql('INSERT INTO file (full_file_name, data) VALUES (?, ?)',
						 [file.fullFileName, file.data]);
		});
	};
	
	DBFileSystem.prototype.openDialog = function(callback) {
		log.error("openDialog not implemented yet");
	};
	
	return DBFileSystem;
})