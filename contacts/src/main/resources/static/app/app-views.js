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
            style: 'touch-action: none; display: none;z-index:999;'
        },
        initialize: function (options) {
            this.childLayer = {};
            if (_.has(options, 'z-index'))
                this._zIndex = options['z-index'];
            else
                this._zIndex = parseInt(this.$el.css('z-index'));
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

        },
        showDimmed: function (zIndex) {
            if (zIndex)
                this.$el.css('z-index', zIndex);
            else if (this._zIndex !== this.$el.css('z-index'))
                this.$el.css('z-index', this._zIndex)
            this.$el.show();
        },
        hideDimmed: function () {
            if (this._zIndex !== this.$el.css('z-index'))
                this.$el.css('z-index', this._zIndex)
            this.$el.hide();
        },
        showCompositeDimmed: function (el, zIndex) {
            if (_.has(this.childLayer, zIndex))
                throw new Error('Layer already exists. z-index: ' + zIndex);
            this.childLayer[zIndex] = new app.DimmedLayer();
            this.childLayer[zIndex].render().$el.appendTo(el);
            if (zIndex)
                this.childLayer[zIndex].showDimmed(zIndex);
        },
        closeCompositeDimmed: function (zIndex) {
            if (_.has(this.childLayer, zIndex)) {
                this.childLayer[zIndex].close();
                delete this.childLayer[zIndex];
            }
        }

    });

    app.OverlayLayer = Backbone.Marionette.ItemView.extend({
        initialize: function () {
            this.listenTo(app.vent, 'show:overlay-loading', function () {
                app.dimmedLayer.showDimmed();
                this.$el.show();
            });
            this.listenTo(app.vent, 'hide:overlay-loading', function () {
                app.dimmedLayer.hideDimmed();
                this.$el.hide();
            });
        },
        template: function () {
            var html, compiledTemplate = app.OverlayLayer.compiledTemplate;
            if (!compiledTemplate) {
                html = app.$template.filter('#overlay-template').html();
                compiledTemplate = _.template(html);
                app.OverlayLayer.compiledTemplate = compiledTemplate;
            }
            html = compiledTemplate();
            return html;
        },
        onRender: function () {
            this.$el.appendTo(app.rootElement);
        }
    });

});