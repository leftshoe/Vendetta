
function isAir() {
	return typeof(runtime) != "undefined";
}

require(
	{
		baseUrl: "app",
		urlArgs: "bust=" +  (new Date()).getTime()
	},
	[
		"Logging/Log",
		"File/FileSystem",
		
		// Debugging stuff
		"lib/air/AIRIntrospector.js",
		"lib/air/AIRSourceViewer.js"
	],
	function(Log, FileSystem) {
		$(function(){
			var log = new Log("main");
			log.trace("Initialising stuff");
			
			//TODO: this needs to be moved into it's own class
			require({ baseUrl: "lib/"},
			    [
			        "ace/lib/event",
			        "ace/editor",
			        "ace/virtual_renderer",
			        "ace/theme/textmate",
			        "ace/document",
			        "ace/mode/javascript",
			        "ace/mode/css",
			        "ace/mode/html",
			        "ace/mode/xml",
			        "ace/mode/text",
			        "ace/undomanager"
			    ], function(event, Editor, Renderer, theme, Document, JavaScriptMode, 
							CssMode, HtmlMode, XmlMode, TextMode, UndoManager) {
																
					var doc = new Document($('#editor-contents').html());
					doc.setMode(new JavaScriptMode());
					doc.setUndoManager(new UndoManager());

					var editor = new Editor(new Renderer($('.editor')[0], theme));
					editor.setDocument(doc);
					editor.focus();
					editor.resize();
					
					window.onresize = function() {
						editor.resize();
					}
					
					FileSystem.openDialog(function(file_name) {
						FileSystem.open(file_name, function(f) {
							var doc = new Document(f.data);
							doc.setMode(new JavaScriptMode());
							doc.setUndoManager(new UndoManager());
							editor.setDocument(doc);
						});
					});
			});
			
			
		});
		
	});