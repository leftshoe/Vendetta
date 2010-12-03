
define(["app/Logging/Log", "templates/Find.js"], function(Log) {
	var log = new Log('FindAndReplace');
	
	var FindAndReplace = function() {
		this.model = new Backbone.Model();
		this.view = new FindAndReplaceView({
			model: this.model
		});
		this.view.render();
		$('body').append(this.view.el);
	};
	
	var FindAndReplaceView = Backbone.View.extend({
		tagName: "div",
		id: "find-dialog",
		className: "mini-dialog",
		
		events: {
			"click #check-regex": "toggleRegex",
			"click #check-wrap": "toggleWrap",
			"click #check-case": "toggleCase"
		},
		initialize: function(options) {
		},
		render: function() {
			log.trace('Rendering find-and-replace');
			$(this.el).html(template.find());
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
		}
	});
	
	return FindAndReplace;
});