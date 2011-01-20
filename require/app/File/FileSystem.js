
define(["./AirFileSystem", "./DBFileSystem"], function(AirFileSystem, DBFileSystem) {
	
	return isAir() ? AirFileSystem : new DBFileSystem ();
});