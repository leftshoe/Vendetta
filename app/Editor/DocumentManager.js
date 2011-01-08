
define(["app/Logging/Log",
		"ace/document", 
		"app/Notification",
		"app/File/FileSystem",
		"app/PromptToSave",
		"app/File/FileChanged",
		"./DocumentCollection",
		"ace/mode/javascript",
	    "ace/mode/css",
	    "ace/mode/html",
	    "ace/mode/xml",
	    "ace/mode/text",
	    "ace/undomanager"],
	function(Log, Document, Notification, FileSystem, PromptToSave, FileChanged, DocumentCollection,
			 JavascriptMode, CssMode, HtmlMode, XmlMode, TextMode, UndoManager) {
				
	var log = new Log("DocumentManager");

	var DocumentManager = function(core, editor) {
		_.bindAll(this, 'editFile', 'isNothingInputed', 'showFolderOf', 
						'openFile', 'newDocument', 'activate', 'save');
						
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
			// This is only triggered in metamode, and we want it to go back into metamode
			FileSystem.openDirectoryDialog(function(f) {
				self.showFolderOf(f);
				core.trigger('togglemetamode');
			});
		});
		core.bind("open", function(e) {
			if(FileSystem.isDirectory(e.fileName)) {
				var dir = FileSystem.loadDirectory(e.fileName);
				self.showFolderOf(dir);
			} else {
				FileSystem.open(e.fileName, self.openFile);	
			}
		});
		core.bind("save", function() {
			self.save(self.active);
		});
		core.bind("saveall", function() {
			self.documents._().each(self.save);
		});
		core.bind("savedocument", function(e) {
			var doc = self.documents.getById(e.id);
			self.save(doc);
		});
		core.bind("saveas", function(opt_doc) {
			var doc = opt_doc || self.active; 
			FileSystem.saveas(doc.toString(), function(f) {
				doc.file = f;
				core.trigger('saved', doc);
			});
		});
		core.bind("revertdocument", function(e) {
			var doc = self.documents.getById(e.id);
			FileSystem.open(doc.file.getFullFileName(), function(f) {
				doc.setValue(f.getData());
				doc.file.set({
					data: f.getData(),
					modificationDate: f.get('modificationDate')
				});
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
		core.bind("promptclosedocument", function(e) {
			var doc = self.documents.getById(e.id);
			if(self.isSaved(doc)) {
				core.trigger('closedocument', e);
			} else {
				var saveDialog = new PromptToSave(core, e.id);
				saveDialog.show();
			}
		});
		core.bind("closedocument", function(e) {
			var doc = self.documents.getById(e.id);
			
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
			
			// Remove file system monitoring handler
			doc.file.unbind('changedOnFilesystem');
			
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
	
	DocumentManager.prototype.save = function(doc) {
		if(doc.file) {
			doc.file.set({'data': doc.toString()});
			FileSystem.save(doc.file);
			doc.changed = false;
			
			this.core.trigger('saved', doc);
			this.core.trigger('docschanged', this.documents);
		} else {
			log.trace("No currentFile");
			this.core.trigger("saveas", doc);
		}
	};
		
	DocumentManager.prototype.isSaved = function(opt_doc) {
		var doc = opt_doc || this.active;
		log.trace('isSaved called');
		var txt = doc.toString();
		return doc.file ?  
			(doc.file.getData() == txt)
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
		var self = this;
		log.trace('newDocument');
		
		var data = f ? f.getData() : '';
		var doc = new Document(data);
		doc.setUndoManager(new UndoManager());
		
		doc.file = f;
		self.determineDocMode(doc);
		self.documents.add(doc);
		
		doc.addEventListener('change', function() {
				log.trace('change event invoked on document');
				doc.changed = true;
				self.core.trigger('docschanged', self.documents);
		});
		
		self.core.trigger('docschanged', self.documents);
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
		var self = this;
		
		// New document should 'overwrite' a single empty unsaved document
		if(self.isNothingInputed()) {
			// Active folder in file browser is changed to the directory of the first opened file
			if(!self.hasShownDirectory) {
				self.showFolderOf(f);
			}
			
			self.documents.remove(self.active);
		}
		
		self.core.trigger('closemetamode');
		
		// Is file already open ?
		var existing = self.documents.getByFullFileName(f.getFullFileName());
		if(existing) {
			log.trace('File already open');
			self.activate(existing);
		} else {
			var doc = self.newDocument(f);
			
			// Handle changes from outside this application
			doc.file.bind('changedOnFilesystem', function() {
				var changedDialog = new FileChanged(self.core, doc);
				changedDialog.show();
			});
			
			self.activate(doc);	
		}
		
		self.documents.logStatus();
	};
	
	return DocumentManager;
});