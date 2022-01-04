define(['app', 'text!app/app-template.html'], function (app, template) {

    app.$template = $(template);

    app.HeaderView = Backbone.Marionette.ItemView.extend({
        template: function () {
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
        className: 'service_info',
        template: function () {
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

    app.DimmedLayer = Backbone.Marionette.ItemView.extend({
        className: 'dimm_layer',
        attributes: {
            style: 'touch-action: none; display: none;'
        },
        initialize: function () {
            this.listenTo(app.vent, 'show:dimmed', function () {
                this.$el.show();
            });
            this.listenTo(app.vent, 'hide:dimmed', function () {
                this.$el.hide();
            });
        },
        template: function () {
            var html, compiledTemplate = app.DimmedLayer.compiledTemplate;
            if (!compiledTemplate) {
                html = app.$template.filter('#dimmed-layer-template').html();
                compiledTemplate = _.template(html);
                app.DimmedLayer.compiledTemplate = compiledTemplate;
            }
            html = compiledTemplate();
            return html;
        },
        onRender: function () {
            this.$el.appendTo(app.rootElement);
        }
    });

});