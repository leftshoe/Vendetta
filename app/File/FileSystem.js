
define(["./AirFileSystem", "./DBFileSystem"], function(AirFileSystem, DBFileSystem) {
	
	return isAir() ? new AirFileSystem() : new DBFileSystem();
	
});