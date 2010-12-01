
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
		"app/window-util.js",
		"lib/air/AIRIntrospector.js",
		"lib/air/AIRSourceViewer.js",
		"lib/overlay.js",
		"lib/toolbox.expose.js"
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
			core.bind('newwindow', function() {
				openWindow();
			});
			
			if(isAir()) {
				// window starts hidden to avoid graphical gliches
				window.nativeWindow.visible = true;
				
				var force_close = false;
				var promptDialog = $('#prompt-dialog');
				
				//Prompt to save before closing the window
				window.nativeWindow.addEventListener(air.Event.CLOSING, function(e) {
					if(force_close || !editor.isSaved()) {
						promptDialog.overlay({
							closeOnClick: false,
							load: true,
							mask: {
								color: '#ebecff',
								loadSpeed: 200,
								opacity: 0.8
							}
						});
						
						promptDialog.data("overlay").load();
						e.preventDefault();
					}
				});
				
				$('#save', promptDialog).click(function() {
					core.trigger('save');
					window.close();
				});
				
				$('#close', promptDialog).click(function() {
					force_close = true;
					window.close();
				});
			}
		});
		
	});