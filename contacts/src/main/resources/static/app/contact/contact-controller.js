define(['app', 'app/app-init', 'app/contact/contact-models', 'app/contact/contact-views'], function (app) {

    app.module('contact', function (contact, app, Backbone, Marionette, $, _) {

        contact.Controller = Backbone.Marionette.Controller.extend({
            initialize: function () {
                app.vent.trigger('show:overlay-loading');
                contact.groupCollection = new contact.GroupCollection();
                contact.contactPaginator = new contact.ContactPaginator();
                contact.contactPaginator.fetch({
                    async: false
                });
                contact.contactCollection = new contact.ContactCollection(contact.contactPaginator.edges);
                contact.contactCollection.sort({silent: true});
                contact.contactGroupCollection = new contact.ContactCollection();
                contact.trashCollection = new contact.ContactCollection();

                this.showSidebarView();
                this.showContentLayout();
                app.vent.trigger('hide:overlay-loading');

                this.listenTo(app.vent, 'sync:contact-groups-information', this.syncContactGroup);
                this.listenTo(app.vent, 'move:trash', this.moveToTrash);
                this.listenTo(app.vent, 'remove:contacts', this.removeContacts);
                this.listenTo(app.vent, 'create:contact', this.createContact);
                this.listenTo(app.vent, 'update:important', this.updateImportant);
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

                var trashContactPaginator = new contact.ContactPaginator({
                    trash: 2
                });
                trashContactPaginator.fetch({
                    async: false
                });
                contact.trashCollection.reset(trashContactPaginator.edges, {silent: true});
                app.vent.trigger('show:contact-search', contact.trashCollection, part);
                app.vent.trigger('show:contact-list', contact.trashCollection, part);

                // contact.trashCollection.fetch({
                //     url: contact.trashCollection.url + '?' + $.param({'trash': 2}),
                //     success: function () {
                //         contact.trashCollection.sort({silent: true});
                //         app.vent.trigger('show:contact-search', contact.trashCollection, part);
                //         app.vent.trigger('show:contact-list', contact.trashCollection, part);
                //     }
                // });
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

                var models = _.filter(collection.models, function (model) {
                    return _.contains(params.contactIDList, model.id);
                });
                _.each(models, function (model) {
                    model.set('groups', groups);
                });

                if (part === 'trash') {
                    contact.contactCollection.add(models);
                    app.vent.trigger('fetch:contact-count', ['all']);
                    app.vent.trigger('fetch:group-collection');
                }

                location.hash = location.hash + '?_=' + new Date().getTime();
            },
            moveToTrash: function (params) {
                if (!params || !params.part || !params.contactIDList)
                    return;

                var collection = ('trash' === params.part && contact.trashCollection) ||
                    contact.contactCollection;
                var removedModels = _.filter(collection.models, function (model) {
                    return _.contains(params.contactIDList, model.id)
                });
                if (removedModels.length === 0)
                    return;

                collection.remove(removedModels);
                app.vent.trigger('fetch:contact-count', ['all', 'recently', 'important']);
                app.vent.trigger('fetch:group-collection');
                location.hash = location.hash + '?_=' + new Date().getTime();
            },
            removeContacts: function (contactIDList) {
                if (!contactIDList || contactIDList.length === 0)
                    return;

                var removedModels = _.filter(contact.trashCollection.models, function (model) {
                    return _.contains(contactIDList, model.id)
                });
                contact.trashCollection.remove(removedModels);
                location.hash = location.hash + '?_=' + new Date().getTime();
            },
            createContact: function (model) {
                contact.contactCollection.add(model);
                location.hash = location.hash.indexOf('trash') > -1 ?
                    '' :
                    location.hash + '?_=' + new Date().getTime();
            },
            updateImportant: function (contactID, important) {
                var contactModel = contact.contactCollection.find('id', contactID);
                if (!contactID)
                    throw new Error('Not Found ContactModel ID: ' + contactID);

                contactModel.save({
                    id: contactModel.id,
                    important: important
                }, {
                    patch: true,
                    success: function () {
                        app.vent.trigger('fetch:contact-count', ['important'], {
                            important: important === 1 ? 1 : -1,
                        });
                    }
                })
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