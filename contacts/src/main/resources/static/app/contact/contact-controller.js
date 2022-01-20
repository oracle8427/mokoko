define(['app', 'app/app-init', 'app/contact/contact-models', 'app/contact/contact-views'], function (app) {

    app.module('contact', function (contact, app, Backbone, Marionette, $, _) {

        contact.Controller = Backbone.Marionette.Controller.extend({
            initialize: function (options) {
                app.vent.trigger('show:overlay-loading');
                contact.groupCollection = new contact.GroupCollection();
                contact.contactCollection = new contact.ContactCollection();
                contact.contactGroupCollection = new contact.ContactCollection();
                contact.trashCollection = new contact.ContactCollection();
                contact.contactCollection.fetch({
                    silent: true,
                    async: false,
                    success: function () {
                        contact.contactCollection.sort('fullName');
                    }
                });
                this.showSidebarView();
                this.showContentLayout();
                app.vent.trigger('hide:overlay-loading');

                this.listenTo(app.vent, 'sync:contact-groups-information', this.syncContactGroup);
                this.listenTo(app.vent, 'move:trash', this.moveToTrash);
                this.listenTo(app.vent, 'add:contact', this.addContact);
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
            contacts: function (part) {
                app.vent.trigger('show:contact-search', contact.contactCollection, part);
                app.vent.trigger('show:contact-list', contact.contactCollection, part);
            },
            groupContacts: function (part, groupID, params) {
                groupID = parseInt(groupID)
                if (_.isNaN(groupID))
                    return;

                var collection = new contact.ContactCollection(
                    _.filter(contact.contactCollection.models, function (model) {
                        if (model.get('groups').length > 0)
                            console.log(model);
                        return _.contains(_.map(model.get('groups'), 'id'), groupID);
                    })
                );
                app.vent.trigger('show:contact-search', collection, part);
                app.vent.trigger('show:contact-list', collection, part);
                /*-
                contact.contactGroupCollection.fetch({
                    silent: true,
                    url: contact.contactGroupCollection.url + '?' + $.param(params),
                    success: function () {
                        app.vent.trigger('show:contact-search', contact.contactGroupCollection, part);
                        app.vent.trigger('show:contact-list', contact.contactGroupCollection, part);
                    }
                });
               */
            },
            recently: function (part) {
                var collection = new contact.ContactCollection(
                    _.filter(contact.contactCollection.models, function (model) {
                        return model.get('recentDate');
                    })
                );
                app.vent.trigger('show:contact-search', collection, part);
                app.vent.trigger('show:contact-list', collection, part);
            },
            important: function (part) {
                var collection = new contact.ContactCollection(
                    _.filter(contact.contactCollection.models, function (model) {
                        return model.get('important') > 0;
                    })
                );
                app.vent.trigger('show:contact-search', collection, part);
                app.vent.trigger('show:contact-list', collection, part);
            },
            trash: function (part) {
                contact.trashCollection.fetch({
                    url: contact.trashCollection.url + '?' + $.param({'trash': 2}),
                    success: function () {
                        app.vent.trigger('show:contact-search', contact.trashCollection, part);
                        app.vent.trigger('show:contact-list', contact.trashCollection, part);
                    }
                });
            },
            syncContactGroup: function (params) {
                if (!params)
                    return;
                var part = params.part || 'all';
                var collection = ('trash' === part && contact.trashCollection) ||
                    contact.contactCollection; // all, groups, recently, important

                var groups = [];
                var groupIDList = params.groupIDList || [];
                _.each(contact.groupCollection.models, function (model) {
                    if (_.contains(groupIDList, model.id))
                        groups.push(model.toJSON());
                });
                _.each(collection.models, function (model) {
                    if (_.contains(params.contactIDList, model.id)) {
                        model.set('groups', groups);
                    }
                });
                location.hash = location.hash + '?_=' + new Date().getTime();
            },
            moveToTrash: function (params) {
                if (!params || !params.part)
                    return;

                var collection = ('trash' === params.part && contact.trashCollection) ||
                    contact.contactCollection;
                collection.remove(params.removedModels);
                location.hash = location.hash + '?_=' + new Date().getTime();
            },
            addContact: function (model) {
                contact.contactCollection.add(model);
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
            if (contact.contactCollection) {
                delete contact.contactCollection;
            }

            if (contact.contactGroupCollection) {
                delete contact.contactGroupCollection;
            }

            if (contact.trashCollection) {
                delete contact.trashCollection;
            }

            if (contact.controller) {
                contact.controller.close();
                delete contact.controller;
            }
        });

    });

});