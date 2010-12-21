
define(["app/Logging/Log"], function(Log) {
	var log = new Log('DocumentCollection');
	
	var DocumentCollection = function() {
		this.lastId = 0;
		this.documents = [];
	};
	
	DocumentCollection.prototype.add = function(doc) {
		if(!doc.id) {
			doc.id = ++this.lastId;
		} {
			log.trace('Has id: ' + doc.id);
		}
		
		this.documents.push(doc);
	};
	
	DocumentCollection.prototype.remove = function(doc) {
		this.documents = _.reject(this.documents, function(odoc) {
			return doc.id == odoc.id;
		})
	};
	
	DocumentCollection.prototype.first = function() {
		return _.first(this.documents);
	};
	
	DocumentCollection.prototype.last = function () {
		return _.last(this.documents);
	};
	
	DocumentCollection.prototype.logStatus = function() {
		log.trace('tabs: ');
		_.each(this.documents, function(doc) {
			log.trace('id: ' + doc.id + ' file: ' + (doc.file ? doc.file.getFileName() : 'none'));
		});
	};

	return DocumentCollection;
});