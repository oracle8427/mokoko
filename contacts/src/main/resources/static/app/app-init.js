define(['jquery', 'app', 'app/app-views'], function ($, app) {
    app.addInitializer(function () {
        app.debug("app.addInitializer(function(options) { ");
        app.headerRegion.show(new app.HeaderView());
        app.footerRegion.show(new app.FooterView());
        if (!app.dimmedLayer) {
            app.dimmedLayer = new app.DimmedLayer();
            app.dimmedLayer.render();
            app.dimmedLayer.$el.appendTo(app.rootElement);
        }
        if (!app.overlayLayer) {
            app.overlayLayer = new app.OverlayLayer();
            app.overlayLayer.render();
        }
        app.debug("} // app.addInitializer(function(options) {...});");
    });
    return app;
});