
var isAir = function() {
	return typeof(runtime) != "undefined";
};

var isMac = function() {
	return !!navigator.platform.match(/Mac/);
};

var isWin = function() {
	return !!navigator.platform.match(/Win/);
}

var getOS = function() {
	if(isMac()) {
		return 'mac';
	} else if(isWin()) {
		return 'win';
	} else {
		return 'linux';
	}
};

var assert = function(b) {
	if(!b) {
		throw new Exception('assertion failed');
	}
};

document.title = "untitled - Vendetta";

require({ baseUrl: ""}, [
	"lib/air/AIRAliases.js",
	"lib/backbone.js",
	"lib/soyutils.js",
	"lib/jquery-ui-1.8.6.js"
], function() {
	require(
		{
			baseUrl: "",
			urlArgs: "bust=" +  (new Date()).getTime()
		},
		[
			"app/Logging/Log",
			"app/File/FileSystem",
			"app/Keyboard/keybinding",
			"app/Core",
			"app/Editor/DocumentManager",
			"app/MetaMode",
			"app/Editor/editor",
			"app/PromptToSaveAll",
			"app/FindAndReplace",
			"app/randomise-gutter",
			"app/Notification",
			"app/FileBrowser/FileBrowser",
			"app/Editor/DocumentTable",
			"app/File/Directory",
			"app/window-util.js",
			"lib/air/AIRIntrospector.js",
			"lib/air/AIRSourceViewer.js",
			"lib/overlay.js",
			"lib/toolbox.expose.js"
		],
		function(Log, FileSystem, KeyBinding, Core, DocumentManager, MetaMode, Editor, PromptToSaveAll, FindAndReplace,
				 randomiseGutter, Notification, FileBrowser, DocumentTable, Directory) {
					
			$(function(){
				var log = new Log("main");
				log.trace("Initialising stuff");

				var element = $('.editor')[0];
				var core = new Core();
				var editor = new Editor(element, core);
				var metaMode = new MetaMode(core, editor);
				var keybinding = new KeyBinding($('body')[0], core);
				var findAndReplace = new FindAndReplace(core);
				randomiseGutter();
				
				var fileBrowser = new FileBrowser(core);
				metaMode.addWidget(fileBrowser);
				
				var documentTable = new DocumentTable(core);
				metaMode.addWidget(documentTable);
				
				var documentManager = new DocumentManager(core, editor);

				//TODO: find a better spot for this
				core.bind('activedocumentchanged',function(doc) {
					var fileName = doc.file ? doc.file.getFileName() : 'untitled';
					document.title = fileName + " - Vendetta";
				});
				core.bind('newwindow', function() {
					openWindow(null, window.nativeWindow);
				});
				
				// File object is passed in 
				if(window.argFileName) {
					log.trace("new window's editor, argFileName: " + window.argFileName);
					core.trigger('open', {fileName: window.argFileName});
				} else {
					log.trace("Setting empty document");
				}

				if(isAir()) {
					// window starts hidden to avoid graphical gliches
					window.nativeWindow.visible = true;
					var promptToSave = new PromptToSaveAll(core, documentManager);
					
					if(isMac()) {
						// "select all" (Cmd-A) is not passed to html event system for some reason.
						// Only way to capture it is by a handler on the menu item.
						var app = air.NativeApplication.nativeApplication;
						var select_all_menu = app.menu.items[2].submenu.items[4];
						select_all_menu.addEventListener(air.Event.SELECT, function(e) {
							log.trace('select all menu');
							core.trigger('selectall');
						});
					}
				}
			});

		});	
});