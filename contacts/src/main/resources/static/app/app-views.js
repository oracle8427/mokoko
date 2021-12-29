define([ 'app', 'text!app/app-template.html'], function(app, template) {

	app.$template = $(template);

	app.HeaderView = Backbone.Marionette.ItemView.extend({
		template : function() {
			var html, compiledTemplate = app.HeaderView.compiledTemplate;
			if (!compiledTemplate) {
				html = app.$template.filter('#header-template').html();
				compiledTemplate = _.template(html);
				app.HeaderView.compiledTemplate = compiledTemplate;
			}
			html = compiledTemplate();
			return html;
		}
	});

	app.FooterView = Backbone.Marionette.ItemView.extend({
		className : 'service_info',
		template : function() {
			var html, compiledTemplate = app.FooterView.compiledTemplate;
			if (!compiledTemplate) {
				html = app.$template.filter('#footer-template').html();
				compiledTemplate = _.template(html);
				app.FooterView.compiledTemplate = compiledTemplate;
			}
			html = compiledTemplate();
			return html;
		}
	});

});