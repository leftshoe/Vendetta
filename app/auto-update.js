
if(air.Capabilities.playerType != "Desktop" || !air.Capabilities.isDebugger) {
	setTimeout(function () {
		try {
			air.trace('auto-update initializing ...');	
			var appUpdater = new runtime.air.update.ApplicationUpdaterUI();
			appUpdater.configurationFile = new air.File('app:/updateConfig.xml');
			
			appUpdater.addEventListener(air.ErrorEvent.ERROR, function(e) {
				air.trace('Error: ' + e);
			});
			
			appUpdater.addEventListener(air.ProgressEvent.PROGRESS, function(e) {
				air.trace('Progress: ' + e.message + ' bytes loaded: ' + 
						  e.bytesLoaded + ' total: ' + e.bytesTotal);
			});
			
			appUpdater.addEventListener(air.UpdateEvent.INITIALIZED, function(e) {
				air.trace('Initialized: ' + e.toString());
				appUpdater.checkNow();
			});
			
			appUpdater.addEventListener(air.StatusUpdateErrorEvent.UPDATE_ERROR, function(e) {
				air.trace('StatusUpdateError: ' + e.toString());
			});
			
			appUpdater.addEventListener(air.UpdateEvent.CHECK_FOR_UPDATE, function(e) {
				air.trace('CheckForUpdate: ' + e);
			});
			
			appUpdater.addEventListener(air.DownloadErrorEvent.DOWNLOAD_ERROR, function(e) {
				air.trace('DownloadError: ' + e + " id: " + e.errorID);
			});
			
			appUpdater.addEventListener(air.StatusFileUpdateErrorEvent.FILE_UPDATE_ERROR, function(e) {
				air.trace('FileUpdateError: ' + e + " path: " + e.path);
			});
			
			appUpdater.initialize();
			air.trace('auto-update initialized');
		} catch (e) {
			air.trace('Auto update failed to initialize: ' + e.message);
		}
	}, 2000);	
} else {
	air.trace('Skipping auto-update due to being in debug mode');
}