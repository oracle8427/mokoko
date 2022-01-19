define(['app', 'app/app-init', 'app/contact/contact-controller'], function (app) {

    app.module('contact', {
        startWithParent: false,
        define: function (contact, app, Backbone, Marionette, $, _) {
            'use strict';
            var Router = Backbone.Router.extend({
                routes: {
                    '': 'contacts',
                    'groups/:id': 'groupContacts',
                    'recently': 'recently',
                    'important': 'important',
                    'import': 'importContact',
                    'export': 'exportContact',
                    'trash': 'trash'
                },
                before: function () {
                    app.startSubModule('contact', {
                        contentRegion: app.contentRegion
                    });
                    app.contentRegion.show(app.contact.controller.contentLayout);
                },
                contacts: function () {
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.contacts('all');
                        });
                    } else {
                        app.contact.controller.contacts('all');
                    }
                },
                groupContacts: function (groupID, params) {
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.groupContacts('groups', groupID, params);
                        });
                    } else {
                        app.contact.controller.groupContacts('groups', groupID, params);
                    }
                },
                recently: function () {
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.recently('recently');
                        });
                    } else {
                        app.contact.controller.recently('recently');
                    }
                },
                important: function () {
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.important('important');
                        });
                    } else {
                        app.contact.controller.important('important');
                    }
                },
                trash: function () {
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.trash('trash');
                        });
                    } else {
                        app.contact.controller.trash('trash');
                    }
                },
                importContact: function () {
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.importContact();
                        });
                    } else {
                        app.contact.controller.importContact();
                    }
                },
                exportContact: function () {
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.exportContact();
                        });
                    } else {
                        app.contact.controller.exportContact();
                    }
                }
            });

            app.addInitializer(function () {
                new Router();
            });

        }
    });
});
