
define(["app/Logging/Log", "templates/Find.js"], function(Log) {
	var log = new Log('FindAndReplace');
	var ESC_KEY = 27;
	var ENTER_KEY = 13;
	
	var FindAndReplace = function(core) {
		_.bindAll(this, 'find', 'replace', 'replaceAll');
		self = this;
		
		self.core = core;
		self.model = new Backbone.Model();
		self.view = new FindAndReplaceView({
			model: self.model,
			core: core
		});
		
		self.view.render();
		$('body').append(self.view.el);
		
		core.bind('openfind', function() {
		    core.trigger('closemetamode');
			$(self.view.el).show();
			self.view.focus();
		});
		core.bind('enteredmetamode', function() {
		    self.view.close(); 
		});
		
		self.model.bind('find', this.find);
		self.model.bind('change:find', this.find);
		self.model.bind('change:case', this.find);
		self.model.bind('change:regex', this.find);
		self.model.bind('replace', this.replace);
		self.model.bind('replaceall', this.replaceAll);
	};
	
	FindAndReplace.prototype.getOptions = function() {
		return {
			wrap: !!this.model.get('wrap'),
			caseSensitive: !!this.model.get('case'),
			regExp: !!this.model.get('regex')
		};
	};
	
	FindAndReplace.prototype.find = function() {
		log.trace('triggering find');
		this.core.trigger('find', this.model.get('find'), this.getOptions());
	};
	
	FindAndReplace.prototype.replace = function() {
		this.core.trigger('replace', this.model.get('replace'), this.getOptions());
	};
	
	FindAndReplace.prototype.replaceAll = function() {
		this.core.trigger('replaceall', this.model.get('replace'), this.getOptions());
	};
	
	var FindAndReplaceView = Backbone.View.extend({
		tagName: "div",
		id: "find-dialog",
		className: "mini-dialog",
		
		events: {
			"click #check-regex": "toggleRegex",
			"click #check-wrap": "toggleWrap",
			"click #check-case": "toggleCase",
			"keydown #find-input": "keydown",
			"keydown #replace-input": "keydown",
			"change #find-input": "findChange",
			"change #replace-input": "replaceChange",
			"click #up": "findPrevious",
			"click #down": "findNext",
			"click #find-close": "close",
			"click #replace": "replace",
			"click #replace-all": "replaceAll"
		},
		initialize: function(options) {
			_.bindAll(this, 'findKeydown');
			this.core = options.core;
		},
		render: function() {
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
			this.core.trigger('focus');
		},
		replace: function() {
			this.model.trigger('replace');
		},
		replaceAll: function() {
			this.model.trigger('replaceall');
		},
		focus: function() {
			$('#find-input').focus();
		},
		keydown: function(e) {
			if(e.keyCode == ESC_KEY) {
				this.close();
			}
			if(e.keyCode == ENTER_KEY) {
			     this.model.trigger('find');   
			}
			if(!e.ctrlKey && !e.metaKey) {
			    // Otherwise special keys bubble to the editor.
			    e.stopPropagation();
			}
		}
	});
	
	return FindAndReplace;
});