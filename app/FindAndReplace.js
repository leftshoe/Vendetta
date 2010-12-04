
define(["app/Logging/Log", "templates/Find.js"], function(Log) {
	var log = new Log('FindAndReplace');
	
	var FindAndReplace = function(core) {
		self = this;
		self.model = new Backbone.Model();
		self.view = new FindAndReplaceView({
			model: self.model,
			core: core
		});
		
		self.view.render();
		$('body').append(self.view.el);
		
		core.bind('openfind', function() {
			$(self.view.el).show();
		});
		self.model.bind('change:find', function(model, text) {
			log.trace('triggering find');
			core.trigger('find', text);
		});
	};
	
	var FindAndReplaceView = Backbone.View.extend({
		tagName: "div",
		id: "find-dialog",
		className: "mini-dialog",
		
		events: {
			"click #check-regex": "toggleRegex",
			"click #check-wrap": "toggleWrap",
			"click #check-case": "toggleCase",
			"change #find-input": "findChange",
			"change #replace-input": "replaceChange",
			"click #up": "findPrevious",
			"click #down": "findNext",
			"click #find-close": "close",
			"click #replace": "replace",
			"click #replace-all": "replaceAll"
		},
		initialize: function(options) {
			this.core = options.core;
		},
		render: function() {
			log.trace('Rendering find-and-replace');
			$(this.el).html(template.find());
			this.$('.button').button();
			$('body').append(this.el);
			return this;
		},
		toggle: function(check) {
			if(this.model.get(check)) {
				$('#check-' + check).removeClass('checked');
			} else {
				$('#check-' + check).addClass('checked');
			}
			var setter = {};
			setter[check] = !this.model.get(check);
			this.model.set(setter);
		},
		toggleRegex: function() {
			this.toggle('regex');
		},
		toggleWrap: function() {
			this.toggle('wrap');
		},
		toggleCase: function() {
			this.toggle('case');
		},
		findChange: function(e) {
			log.trace('findChange: ' + e);
			this.model.set({find: e.target.value});
		},
		replaceChange: function(e) {
			this.model.set({replace: e.target.value});
		},
		findNext: function() {
			this.core.trigger('findnext');
		},
		findPrevious: function() {
			this.core.trigger('findprevious');
		},
		close: function() {
			$(this.el).hide();
		},
		replace: function() {
			this.core.trigger('replace');
		},
		replaceAll: function() {
			this.core.trigger('replaceall');
		}
	});
	
	return FindAndReplace;
});