
define(["app/Logging/Log",
		"ace/document", 
		"app/Notification",
		"app/File/FileSystem",
		"./DocumentCollection",
		"ace/mode/javascript",
	    "ace/mode/css",
	    "ace/mode/html",
	    "ace/mode/xml",
	    "ace/mode/text",
	    "ace/undomanager"],
	function(Log, Document, Notification, FileSystem, DocumentCollection,
			 JavascriptMode, CssMode, HtmlMode, XmlMode, TextMode, UndoManager) {
				
	var log = new Log("DocumentManager");

	var DocumentManager = function(core, editor) {
		_.bindAll(this, 'editFile', 'isNothingInputed', 'showFolderOf', 
						'openFile', 'newDocument', 'activate');
						
		var self = this;
		self.core = core;
		self.editor = editor;
		
		self.documents = new DocumentCollection();
		self.activate(self.newDocument());
		
		self.handleFileCommands();
	};

	DocumentManager.prototype.handleFileCommands = function() {
		var self = this;
		var core = this.core;
		
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
			if(self.active.file) {
				self.active.file.set({'data': self.active.toString()});
				FileSystem.save(self.active.file);
				core.trigger('saved');
			} else {
				log.trace("No currentFile");
				core.trigger("saveas");
			}
		});
		core.bind("saveas", function() {
			FileSystem.saveas(self.active.toString(), function(f) {
				self.active.file = f;
				core.trigger('saved');
			});
		});
		core.bind("saved", function() {
			new Notification({msg: 'Saved'});
		});
		
		core.bind("nexttab", function() {
			var currentIdx = self.documents.indexOf(self.active);
			self.activate(self.documents.get((currentIdx+1) % self.documents.length));
		});
		core.bind("previoustab", function() {
			var currentIdx = self.documents.indexOf(self.active);
			self.activate(self.documents.get((currentIdx-1) % self.documents.length));
		});
		core.bind("activatedocument", function(e) {
			var doc = self.documents.getById(e.id);
			if(doc) {
				self.activate(doc);	
			} else {
				log.trace('no document with id: ' + e.id);
			}
		});
		core.bind("movedocument", function(e) {
			log.trace('moving id: ' + e.id + ' newPosition: ' + e.newPosition);
			var doc = self.documents.getById(e.id);
			var oldPosition = self.documents.indexOf(doc);
			self.documents.move({
				from: oldPosition, 
				to: e.newPosition
			});
			
			self.core.trigger('docschanged', self.documents);
		});
		core.bind("closedocument", function(e) {
			var doc = self.documents.getById(e.id);
			//TODO: check and prompt for save
			
			if(self.documents.length > 1) {
				if(doc.id == self.active.id) {
					// Activate the doc after the deleted one,
					// if possible, otherwise the one before.
					var idx = self.documents.indexOf(doc);
					if(idx == self.documents.length-1) {
						self.activate(self.documents.get(idx-1));
					} else {
						self.activate(self.documents.get(idx+1));
					}
				}
			} else {
				self.activate(self.newDocument());
			}
			
			self.documents.remove(doc);
			self.core.trigger('docschanged', self.documents);
		});
	};

	var extensionModes = {
		'txt': TextMode,
		'css': CssMode,
		'htm': HtmlMode,
		'html': HtmlMode,
		'xml': XmlMode,
		'js': JavascriptMode
	};
		
	DocumentManager.prototype.isSaved = function() {
		log.trace('isSaved called');
		var txt = this.active.toString();
		return this.active.file ?  
			(this.active.file.get('data') == txt)
			: (txt == "");
	};
	
	DocumentManager.prototype.showFolderOf = function(f) {
		log.trace('showing: ' + f.getDirectory());
		this.hasShownDirectory = true;
		this.core.trigger("showfolder", {
			//TODO: optimize?
			folder: FileSystem.loadDirectory(f.getDirectory())
		});
	};
	
	DocumentManager.prototype.isNothingInputed = function() {
		return this.active.toString() === '' && !this.active.file;
	};
	
	DocumentManager.prototype.newDocument = function(f) {
		log.trace('newDocument');
		
		var data = f ? f.get('data') : '';
		var doc = new Document(data);
		doc.setUndoManager(new UndoManager());
		
		doc.file = f;
		this.determineDocMode(doc);
		this.documents.add(doc);
		
		this.core.trigger('docschanged', this.documents);
		return doc;
	};
	
	/**
	 * Treats as 'txt' when file has no extension, and as 'js' when
	 * extension is unrecognised.
	 */
	DocumentManager.prototype.determineDocMode = function(doc) {
		log.trace('Determining doc mode');
		if(doc.file) {
			var ext = doc.file.getExtension();
		}
		var mode = extensionModes[ext || 'txt'];
		mode = mode || JavascriptMode;
		doc.setMode(new mode());
	};
	
	DocumentManager.prototype.activate = function(doc) {
		log.trace('Activating doc:' + doc.id);
		
		this.active = doc;
		this.documents._().each(function(x) {
			x.active = false;
		});
		doc.active = true;
		
		this.editor.setDocument(doc);
		this.core.trigger('activedocumentchanged', doc);
	};
	
	DocumentManager.prototype.openFile = function(f) {		
		// New document should 'overwrite' a single empty unsaved document
		if(this.isNothingInputed()) {
			if(!this.hasShownDirectory) {
				this.showFolderOf(f);
			}
			
			this.documents.remove(this.active);
		} else {
			this.core.trigger('closemetamode');
		}
		
		this.activate(this.newDocument(f));
		this.documents.logStatus();
	};
	
	return DocumentManager;
});