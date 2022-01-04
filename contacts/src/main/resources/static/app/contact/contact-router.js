define(['app', 'app/app-init', 'app/contact/contact-controller'], function (app) {

    app.module('contact', {
        startWithParent: false,
        define: function (contact, app, Backbone, Marionette, $, _) {
            'use strict';
            var Router = Backbone.Router.extend({
                routes: {
                    '(groups/:id)': 'contacts',
                },
                before: function () {
                    app.startSubModule('contact', {
                        contentRegion: app.contentRegion
                    });
                    app.contentRegion.show(app.contact.controller.contentLayout);
                },
                contacts: function (groupID, params) {
                    app.debug('contact-router.contacts(groupID, params)', groupID);
                    if (!app.contact.controller) {
                        app.module('contact').once('start', function () {
                            app.contact.controller.contacts(groupID, params);
                        });
                    } else {
                        app.contact.controller.contacts(groupID, params);
                    }
                }
            });

            app.addInitializer(function () {
                new Router();
            });

        }
    });
});
