define([ 'app', 'text!app/contact/contact-template.html', 'app/contact/contact-models'], function(app, template) {
	app.module('contact', function(contact, app, Backbone, Marionette, $, _) {
		contact.$template = $(template);

		contact.SidebarView = Backbone.Marionette.ItemView.extend({
			template : function() {
				var html, compiledTemplate = contact.SidebarView.compiledTemplate;
				if (!compiledTemplate) {
					html = contact.$template.filter('#sidebar-template').html();
					compiledTemplate = _.template(html);
					contact.SidebarView.compiledTemplate = compiledTemplate;
				}
				html = compiledTemplate();
				return html;
			},
			initialize : function(options) {
				this.listenTo(contact.groupCollection, 'sync', this.render);
			},
			onRender : function() {

			}
		});

		contact.ContentLayout = Backbone.Marionette.Layout.extend({
			template : function(data) {
				var html = contact.$template.filter('#content-layout-template').html();
				var compiledTemplate = _.template(html);
				html = compiledTemplate({
					group : data,
				});
				return html;
			},
			regions : {

			},
			initialize : function(options) {

			},
			onRender : function() {

			}
		});

	});
});