
function isAir() {
	return typeof(runtime) != "undefined";
};

function isMac() {
	return !!navigator.platform.match(/Mac/);
};

document.title = "untitled - Vendetta";

require({ baseUrl: ""}, [
	"lib/air/AIRAliases.js",
	"lib/underscore.js",
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
			"app/Editor/editor",
			"app/PromptToSave",
			"app/FindAndReplace",
			"app/window-util.js",
			"lib/air/AIRIntrospector.js",
			"lib/air/AIRSourceViewer.js",
			"lib/overlay.js",
			"lib/toolbox.expose.js"
		],
		function(Log, FileSystem, KeyBinding, Core, Editor, PromptToSave, FindAndReplace) {
			$(function(){
				var log = new Log("main");
				log.trace("Initialising stuff");

				var element = $('.editor')[0];
				var core = new Core();
				var editor = new Editor(element, core);
				var keybinding = new KeyBinding(element, core);
				var findAndReplace = new FindAndReplace(core);

				//TODO: find a better spot for this
				core.bind('newactivefile',function(f) {
					document.title = f.getFileName() + " - Vendetta";
				});
				core.bind('newwindow', function() {
					openWindow();
				});

				if(isAir()) {
					// window starts hidden to avoid graphical gliches
					window.nativeWindow.visible = true;
					var promptToSave = new PromptToSave(core, editor);
				}
			});

		});	
});