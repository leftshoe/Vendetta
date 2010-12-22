
define(["app/Logging/Log", "app/Widget", "templates/DocumentTable.js"], function(Log, Widget) {

	var log = new Log('DocumentTable');

	var DocumentTable = Widget.extend({
		initialize: function(core) {
			//_.bindAll(this, 'showFolder');
			Widget.prototype.initialize.call(this);
			var self = this;
			self.view = new DocumentTableView({core: core});
			
			self.set({location: "right"});
		}
	});

	var DocumentTableView = Backbone.View.extend({
		tagName: 'div',
		className: 'document-table',
		initialize: function(options) {
			var self = this;
			self.rendered = false;
			self.core = options.core;		
			
			self.core.bind('docschanged', function(docs) {
				self.docs = docs;
				self.render();
			});
			this.core.bind('activedocumentchanged', function(activeDoc) {
				self.render();
			});
		},
		render: function() {
			var self = this;
			log.trace('render');
			
			var view_docs = self.docs._().map(function(doc) {
				return {
					id: doc.id,
					fileName: doc.file ? doc.file.getFileName() : 'untitled',
					directory: doc.file ? doc.file.getDirectory() : '',
					active: !!doc.active
				}
			});
			
			$(self.el).html(template.documentTable({documents: view_docs}));
			
			if(!self.rendered) {
				$('body').append(self.el);
			}
			
			self.$('.button').button();
			self.$('.document-table-list').sortable({helper: 'clone'});
			self.updateHandlers();
			return this;
		},
		updateHandlers: function() {
			var self = this;
			
			self.$('li').click(function() {
				log.trace('document row clicked');
				self.core.trigger('activatedocument', {id: $(this).data('id')});
			});
			
			self.$('.document-table-list').bind('sortupdate', function(event, ui) {
				var id = $(ui.item).data('id');
				var idx = self.$('li').index(ui.item);
				
				self.core.trigger('movedocument', {id: id, newPosition: idx});
				log.trace('ui.position: ' + ui.position);
			});
		}
	});

	return DocumentTable;
	
});