
define(["app/Logging/Log"], function(Log) {
	var log = new Log('DocumentCollection');
	
	var DocumentCollection = function() {
		this.lastId = 0;
		this.documents = [];
		this.length = 0;
	};
	
	DocumentCollection.prototype.add = function(doc) {
		if(!doc.id) {
			doc.id = ++this.lastId;
		} {
			log.trace('Has id: ' + doc.id);
		}
		
		this.documents.push(doc);
		this.length = this.documents.length;
	};
	
	DocumentCollection.prototype.remove = function(doc) {
		this.documents = _.reject(this.documents, function(odoc) {
			return doc.id == odoc.id;
		});
		this.length = this.documents.length;
	};
	
	DocumentCollection.prototype.first = function() {
		return _.first(this.documents);
	};
	
	DocumentCollection.prototype.last = function () {
		return _.last(this.documents);
	};
	
	DocumentCollection.prototype.get = function(idx) {
		return this.documents[idx];
	};
	
	DocumentCollection.prototype.getById = function(id) {
		return _.detect(this.documents, function(odoc) {
			return odoc.id == id;
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
	
	DocumentCollection.prototype.logStatus = function() {
		log.trace('tabs: ');
		_.each(this.documents, function(doc) {
			log.trace('id: ' + doc.id + ' file: ' + (doc.file ? doc.file.getFileName() : 'none'));
		});
	};

	return DocumentCollection;
});