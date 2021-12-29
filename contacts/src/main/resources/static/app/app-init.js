define([ 'jquery', 'app', 'app/app-views'], function($, app) {
	app.addInitializer(function(options) {
		app.debug("app.addInitializer(function(options) { ");
		app.headerRegion.show(new app.HeaderView());
		app.footerRegion.show(new app.FooterView());
		app.debug("} // app.addInitializer(function(options) {...});");
	});
	return app;
});