
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
    "ace/undomanager",
	"app/File/FileSystem",
	"app/Logging/Log",
	"app/Notification"
	], function(event, AceEditor, Renderer, theme, Document, 
				JavascriptMode, CssMode, HtmlMode, XmlMode, 
				TextMode, UndoManager, FileSystem, Log, Notification) {
	var log = new Log("Editor");
					
	var Editor = function(element, core) {
		var self = this;
		_.bindAll(this, 'editFile', 'isNothingInputed', 'showFolderOf', 
						'openFile');	// Makes 'this' pointer correct
		
		var ace = self.ace = new AceEditor(new Renderer(element, theme));
		self.core = core;
		self.el = element;
		ace.focus();
		ace.resize();
		
		window.onresize = function() {
			ace.resize();
		}
				
		self.handleEditCommands(core);
		core.bind('newactivefile', self.editFile);
		
		// File object is passed in 
		if(window.argFileName) {
			log.trace("new window's editor, argFileName: " + window.argFileName);
			core.trigger('open', {fileName: window.argFileName});
		} else {
			// Empty document
			log.trace("Setting empty document");
			self.setDocument('', JavascriptMode);
		}
	};
	
	var extensionModes = {
		'txt': TextMode,
		'css': CssMode,
		'htm': HtmlMode,
		'html': HtmlMode,
		'xml': XmlMode,
		'js': JavascriptMode
	};
	
	Editor.prototype.showFolderOf = function(f) {
		log.trace('showing: ' + f.getDirectory());
		this.hasShownDirectory = true;
		this.core.trigger("showfolder", {
			folder: FileSystem.loadDirectory(f.getDirectory())
		});
	}
	
	Editor.prototype.isSaved = function() {
		log.trace('isSaved called');
		var txt = this.ace.getDocument().toString();
		return this.currentFile ?  
			(this.currentFile.get('data') == txt)
			: (txt == "");
	};
	
	Editor.prototype.editFile = function(f) {
		log.trace("Edit file called: " + f.getFullFileName());
		this.currentFile = f;
		var mode = extensionModes[f.getExtension() || 'txt'];
		mode = mode || JavascriptMode;
		this.setDocument(f.get('data'), mode);
	};
	
	Editor.prototype.isNothingInputed = function() {
		return this.ace.getDocument().toString() === '' && !self.currentFile;
	}
	
	Editor.prototype.setDocument = function(txt, mode) {
		var doc = new Document(txt);
		doc.setMode(new mode());
		doc.setUndoManager(new UndoManager());
		this.ace.setDocument(doc);
	};
	
	Editor.prototype.openFile = function(f) {
		if(this.isNothingInputed()) {
			this.core.trigger("newactivefile", f);
			if(!this.hasShownDirectory) {
				this.showFolderOf(f);
			}
		} else {
			openWindow(f.getFullFileName(), window.nativeWindow);
			this.core.trigger('closemetamode');
		}
	}
	
	Editor.prototype.handleEditCommands = function(core) {
		var self = this;
		var editor = this.ace;
		
		core.bind("focus", function() {
			$('.editor textarea').focus();	
		});
		core.bind("opendialog", function() {
			FileSystem.openDialog(self.openFile);
		});
		core.bind("opendirectorydialog", function() {
			FileSystem.openDirectoryDialog(self.showFolderOf);
		});
		core.bind("open", function(e) {
			FileSystem.open(e.fileName, self.openFile);	
		});
		core.bind("save", function() {
			if(self.currentFile) {
				self.currentFile.set({'data': editor.getDocument().toString()});
				FileSystem.save(self.currentFile);
				core.trigger('saved');
			} else {
				log.trace("No currentFile");
				core.trigger("saveas");
			}
		});
		core.bind("saveas", function() {
			FileSystem.saveas(editor.getDocument().toString(), function(f) {
				self.currentFile = f;
				core.trigger('saved');
			});
		});
		core.bind("saved", function() {
			new Notification({msg: 'Saved'});
		})
		core.bind("selectall", function() {
			log.trace('selectall');
			editor.getSelection().selectAll();
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
		core.bind("find", function(text, options) {
			log.trace('text: ' + text);
		    editor.find(text, options);
		});
		core.bind("replace", function(text, options) {
		    editor.replace(text, options);
		});
		core.bind("replaceall", function(text, options) {
		    editor.replaceAll(text, options);
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
		    editor.getSelection().selectFileStart();
		});
		core.bind("gotostart", function() {
		    editor.navigateFileStart();
		});
		core.bind("selectup", function() {
		    editor.getSelection().selectUp();
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
		    editor.getSelection().selectFileEnd();
		});
		core.bind("gotoend", function() {
		    editor.navigateFileEnd();
		});
		core.bind("selectdown", function() {
		    editor.getSelection().selectDown();
		});
		core.bind("godown", function() {
		    editor.navigateDown();
		});
		core.bind("selectwordleft", function() {
		    editor.getSelection().selectWordLeft();
		});
		core.bind("gotowordleft", function() {
		    editor.navigateWordLeft();
		});
		core.bind("selecttolinestart", function() {
		    editor.getSelection().selectLineStart();
		});
		core.bind("gotolinestart", function() {
		    editor.navigateLineStart();
		});
		core.bind("selectleft", function() {
		    editor.getSelection().selectLeft();
		});
		core.bind("gotoleft", function() {
		    editor.navigateLeft();
		});
		core.bind("selectwordright", function() {
		    editor.getSelection().selectWordRight();
		});
		core.bind("gotowordright", function() {
		    editor.navigateWordRight();
		});
		core.bind("selecttolineend", function() {
		    editor.getSelection().selectLineEnd();
		});
		core.bind("gotolineend", function() {
		    editor.navigateLineEnd();
		});
		core.bind("selectright", function() {
		    editor.getSelection().selectRight();
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
		    editor.getSelection().selectLineStart();
		});
		core.bind("gotolinestart", function() {
		    editor.navigateLineStart();
		});
		core.bind("selectlineend", function() {
		    editor.getSelection().selectLineEnd();
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
		
		// if(isAir()) {
		// 	window.nativeWindow.stage.addEventListener(Event.SELECT_ALL, function() {
		// 		log.trace("SELECT_ALL");
		// 	});
		// }
	};
	
	return Editor;
});