
function isAir() {
	return typeof(runtime) != "undefined";
}

document.title = "untitled - Vendetta";

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
		"app/Editor/editor",
		"lib/air/AIRIntrospector.js",
		"lib/air/AIRSourceViewer.js",
	],
	function(Log, FileSystem, KeyBinding, Core, Editor) {
		$(function(){
			var log = new Log("main");
			log.trace("Initialising stuff");
			
			var element = $('.editor')[0];
			var core = new Core();
			var editor = new Editor(element, core);
			var keybinding = new KeyBinding(element, core);
			
			//TODO: find a better spot for this
			core.bind('newactivefile',function(f) {
				document.title = f.getFileName() + " - Vendetta";
			});
		});
		
	});