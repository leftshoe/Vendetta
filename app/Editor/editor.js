
define([    
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
	], function(event, AceEditor, Renderer, theme, Document, 
				JavaScriptMode, CssMode, HtmlMode, XmlMode, 
				TextMode, UndoManager) {
					
	var Editor = function(element, core) {
		var doc = new Document($('#editor-contents').html());
		doc.setMode(new JavaScriptMode());
		doc.setUndoManager(new UndoManager());

		var ace = this.ace = new AceEditor(new Renderer(element, theme));
		ace.setDocument(doc);
		ace.focus();
		ace.resize();
		
		window.onresize = function() {
			ace.resize();
		}
		
		// FileSystem.openDialog(function(file_name) {
		// 	FileSystem.open(file_name, function(f) {
		// 		var doc = new Document(f.get('data'));
		// 		doc.setMode(new JavaScriptMode());
		// 		doc.setUndoManager(new UndoManager());
		// 		ace.setDocument(doc);
		// 	});
		// });
		
		this.handleEditCommands(core);
	};
	
	Editor.prototype.handleEditCommands = function(core) {
		var editor = this.ace;
		var selection = editor.getSelection();
		
		core.bind('selectall', function() {
			selection.selectAll();
		});
		
		core.bind("removeline", function() {
		    editor.removeLines();
		});
		core.bind("gotoline", function() {
		    var line = parseInt(prompt("Enter line number:"));
		    if (!isNaN(line)) {
		        editor.gotoLine(line);
		    }
		});
		core.bind("togglecomment", function() {
		    editor.toggleCommentLines();
		});
		core.bind("findnext", function() {
		    editor.findNext();
		});
		core.bind("findprevious", function() {
		    editor.findPrevious();
		});
		core.bind("find", function() {
		    var needle = prompt("Find:");
		    editor.find(needle);
		});
		core.bind("undo", function() {
		    editor.undo();
		});
		core.bind("redo", function() {
		    editor.redo();
		});
		core.bind("redo", function() {
		    editor.redo();
		});
		core.bind("overwrite", function() {
		    editor.toggleOverwrite();
		});
		core.bind("copylinesup", function() {
		    editor.copyLinesUp();
		});
		core.bind("movelinesup", function() {
		    editor.moveLinesUp();
		});
		core.bind("selecttostart", function() {
		    selection.selectFileStart();
		});
		core.bind("gotostart", function() {
		    editor.navigateFileStart();
		});
		core.bind("selectup", function() {
		    selection.selectUp();
		});
		core.bind("golineup", function() {
		    editor.navigateUp();
		});
		core.bind("copylinesdown", function() {
		    editor.copyLinesDown();
		});
		core.bind("movelinesdown", function() {
		    editor.moveLinesDown();
		});
		core.bind("selecttoend", function() {
		    selection.selectFileEnd();
		});
		core.bind("gotoend", function() {
		    editor.navigateFileEnd();
		});
		core.bind("selectdown", function() {
		    selection.selectDown();
		});
		core.bind("godown", function() {
		    editor.navigateDown();
		});
		core.bind("selectwordleft", function() {
		    selection.selectWordLeft();
		});
		core.bind("gotowordleft", function() {
		    editor.navigateWordLeft();
		});
		core.bind("selecttolinestart", function() {
		    selection.selectLineStart();
		});
		core.bind("gotolinestart", function() {
		    editor.navigateLineStart();
		});
		core.bind("selectleft", function() {
		    selection.selectLeft();
		});
		core.bind("gotoleft", function() {
		    editor.navigateLeft();
		});
		core.bind("selectwordright", function() {
		    selection.selectWordRight();
		});
		core.bind("gotowordright", function() {
		    editor.navigateWordRight();
		});
		core.bind("selecttolineend", function() {
		    selection.selectLineEnd();
		});
		core.bind("gotolineend", function() {
		    editor.navigateLineEnd();
		});
		core.bind("selectright", function() {
		    selection.selectRight();
		});
		core.bind("gotoright", function() {
		    editor.navigateRight();
		});
		core.bind("selectpagedown", function() {
		    editor.selectPageDown();
		});
		core.bind("pagedown", function() {
		    editor.scrollPageDown();
		});
		core.bind("gotopagedown", function() {
		    editor.gotoPageDown();
		});
		core.bind("selectpageup", function() {
		    editor.selectPageUp();
		});
		core.bind("pageup", function() {
		    editor.scrollPageUp();
		});
		core.bind("gotopageup", function() {
		    editor.gotoPageUp();
		});
		core.bind("selectlinestart", function() {
		    selection.selectLineStart();
		});
		core.bind("gotolinestart", function() {
		    editor.navigateLineStart();
		});
		core.bind("selectlineend", function() {
		    selection.selectLineEnd();
		});
		core.bind("gotolineend", function() {
		    editor.navigateLineEnd();
		});
		core.bind("del", function() {
		    editor.removeRight();
		});
		core.bind("backspace", function() {
		    editor.removeLeft();
		});
		core.bind("outdent", function() {
		    editor.blockOutdent();
		});
		core.bind("indent", function() {
		    editor.indent();
		});
	};
	
	return Editor;
});