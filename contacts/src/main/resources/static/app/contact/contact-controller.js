define(['app', 'app/app-init', 'app/contact/contact-models', 'app/contact/contact-views'], function (app) {

    app.module('contact', function (contact, app, Backbone, Marionette, $, _) {

        contact.Controller = Backbone.Marionette.Controller.extend({
            initialize: function (options) {
                app.vent.trigger('show:overlay-loading');
                contact.groupCollection = new contact.GroupCollection();
                contact.contactCollection = new contact.ContactCollection();
                contact.contactGroupCollection = new contact.ContactCollection();
                contact.contactCollection.fetch({
                    silent: true,
                    async: false
                });
                this.showSidebarView();
                this.showContentLayout();
                app.vent.trigger('hide:overlay-loading');
            },
            onClose: function () {
                this.sidebarView.close();
                this.contentLayout.close();
            },
            showSidebarView: function () {
                this.sidebarView = new contact.SidebarView({
                    groupCollection: contact.groupCollection
                });
                app.snbRegion.show(this.sidebarView);
            },
            showContentLayout: function () {
                this.contentLayout = new contact.ContentLayout({
                    contactCollection: contact.contactCollection
                });
            },
            contacts: function () {
                app.vent.trigger('show:contact-list');
            },
            groupContacts: function (groupID, params) {
                if (!groupID)
                    return;

                params = _.extend({'groupID': groupID}, params)
                contact.contactGroupCollection.fetch({
                    silent: true,
                    url: contact.contactGroupCollection.url + '?' + $.param(params),
                    success: function (collection, models, xhr) {
                        app.vent.trigger('show:contact-list', contact.contactGroupCollection);
                    }
                });
            },
            importContact: function () {
                this.contentLayout.showImportRegion();
            },
            exportContact: function () {
                this.contentLayout.showExportRegion();
            },
        });

        contact.addInitializer(function (options) {
            contact.controller = new contact.Controller({
                contentRegion: options.contentRegion,
            });

        });

        contact.addFinalizer(function (options) {
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