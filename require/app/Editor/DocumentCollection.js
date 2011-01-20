
define(["app/Logging/Log"], function(Log) {
	var log = new Log('DocumentCollection');
	
	var DocumentCollection = function() {
		this.documents = [];
		this.length = 0;
	};
	
	DocumentCollection.prototype.add = function(doc) {
		doc.id = _.uniqueId();
		log.trace('document id: ' + doc.id);	
		this.documents.push(doc);
		this.length = this.documents.length;
	};
	
	DocumentCollection.prototype.remove = function(doc) {
		this.documents = _.reject(this.documents, function(odoc) {
			return doc.id == odoc.id;
		});
		this.length = this.documents.length;
	};
	
	DocumentCollection.prototype.get = function(idx) {
		return this.documents[idx];
	};
	
	DocumentCollection.prototype.getById = function(id) {
		return _.detect(this.documents, function(odoc) {
			return odoc.id == id;
		});
	};
	
	DocumentCollection.prototype.getByFullFileName = function(fileName) {
		return _.detect(this.documents, function(odoc) {
			return odoc.file && odoc.file.getFullFileName() == fileName;
		});
	};
	
	DocumentCollection.prototype.indexOf = function(doc) {
		var index = -1;
		_.each(this.documents, function(odoc, i) {
			if(doc.id == odoc.id) {
				index = i;
			}
		});
		
		return index != -1 ? index : null;
	};
	
	DocumentCollection.prototype.move = function(params) {
		var doc = this.get(params.from);
		log.trace('from: ' + params.from + ' to: ' + params.to + ' id: ' + 
				  doc.id + ' length: ' + this.length);
		this.documents.splice(params.from, 1);	//Remove 1 element
		this.documents.splice(params.to, 0, doc); //Insert at new position
	};
	
	/*
	 * For accessing the standard functional underscore library methods
	 */
	DocumentCollection.prototype._ = function() {
		return _(this.documents);
	};
	
	DocumentCollection.prototype.logStatus = function() {
		log.trace('tabs: ');
		_.each(this.documents, function(doc) {
			log.trace('id: ' + doc.id + ' file: ' + (doc.file ? doc.file.getFileName() : 'none'));
		});
	};

	return DocumentCollection;
});