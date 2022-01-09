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
                    'important': 'important'
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
                            app.contact.controller.contacts();
                        });
                    } else {
                        app.contact.controller.contacts();
                    }
                },
                groupContacts: function (groupID, params) {
                    app.debug('contact-router.contacts(groupID, params)', groupID);
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.groupContacts(groupID, params);
                        });
                    } else {
                        app.contact.controller.groupContacts(groupID, params);
                    }
                },
                recently: function (params) {
                    app.log(params);

                },

                important: function (params) {
                    app.log(params);
                },

            });

            app.addInitializer(function () {
                new Router();
            });

        }
    });
});
