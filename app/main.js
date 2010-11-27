
require(
	{
		baseUrl: "app",
		urlArgs: "bust=" +  (new Date()).getTime()
	},
	[
		"Logging/Log",
		// Debugging stuff
		"lib/air/AIRIntrospector.js",
		"lib/air/AIRSourceViewer.js",
		// Provides easier access to air features
		"lib/air/AIRAliases.js"
	],
	function(Log) {
		$(function(){
			var log = new Log("main");
			log.trace("fish");
			
			
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
			    ], function(event, Editor, Renderer, theme, Document, JavaScriptMode, CssMode, HtmlMode, XmlMode, TextMode, UndoManager) {
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
			});
			
			
		});
		
	});