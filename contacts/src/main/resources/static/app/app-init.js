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
            app.overlayLayer.$el.hide();
        }

        app.characterMap = {
            a: 'rgb(231, 219, 172);',
            b: 'rgb(229, 192, 211);',
            c: 'rgb(244, 152, 151);',
            d: 'rgb(139, 130, 120);',
            e: 'rgb(202, 169, 148);',
            f: 'rgb(183, 184, 178);',
            g: 'rgb(154, 178, 214);',
            h: 'rgb(240, 210, 117);',
            i: 'rgb(227, 169, 175);',
            j: 'rgb(240, 190, 161);',
            k: 'rgb(166, 150, 175);',
            l: 'rgb(167, 210, 139);',
            m: 'rgb(167, 169, 209);',
            n: 'rgb(140, 214, 226);',
            o: 'rgb(199, 195, 178);',
            p: 'rgb(121, 164, 184);',
            q: 'rgb(136, 183, 157);',
            r: 'rgb(165, 182, 195);',
            s: 'rgb(141, 206, 207);',
            t: 'rgb(182, 195, 206);',
            u: 'rgb(123, 167, 207);',
            v: 'rgb(177, 212, 206);',
            w: 'rgb(248, 191, 181);',
            x: 'rgb(129, 172, 130);',
            y: 'rgb(131, 165, 160);',
            z: 'rgb(110, 172, 173);',
        }
        app.debug("} // app.addInitializer(function(options) {...});");
    });
    return app;
});