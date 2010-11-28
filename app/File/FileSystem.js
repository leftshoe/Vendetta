
define(["File/AirFileSystem", "File/DBFileSystem"], function(AirFileSystem, DBFileSystem) {
	
	return isAir() ? new AirFileSystem() : new DBFileSystem();
	
});