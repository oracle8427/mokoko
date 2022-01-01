define([ 'app', 'app/app-init', 'app/contact/contact-models', 'app/contact/contact-views'], function(app) {

	app.module('contact', function(contact, app, Backbone, Marionette, $, _) {

		contact.Controller = Backbone.Marionette.Controller.extend({
			initialize : function(options) {
				contact.groupCollection = new contact.GroupCollection();
				contact.groupCollection.fetch();
				this.showSidebarView();
				this.showContentLayout();
			},
			onClose : function() {
				this.sidebarView.close();
				this.contentLayout.close();
			},
			showSidebarView : function() {
				this.sidebarView = new contact.SidebarView({
					groupCollection : contact.groupCollection
				});
				app.snbRegion.show(this.sidebarView);
			},
			showContentLayout : function() {
				this.contentLayout = new contact.ContentLayout({

				});
				app.contentRegion.show(this.contentLayout);
			},
			contacts : function(groupID, params) {
				if (!groupID) {
					return;
				}

				if (_.size(contact.groupCollection) === 0) {
					this.listenToOnce(contact.groupCollection, 'sync', function() {
						this.contacts(groupID, params);
					});
					return;
				}
			}
		});

		contact.addInitializer(function(options) {
			contact.controller = new contact.Controller({
				contentRegion : options.contentRegion,
			});

		});

		contact.addFinalizer(function(options) {
			if (contact.groupCollection) {
				delete contact.groupCollection;
			}
			if (contact.controller) {
				contact.controller.close();
				delete contact.controller;
			}
		});

	});

});