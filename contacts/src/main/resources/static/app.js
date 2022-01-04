define([ 'marionette' ], function(Marionette) {
	var app = new Marionette.Application();
	app.rootElement = '#root';

	app.log = function(message, object) {
		if(typeof console !== "undefined") {
			object ? console.log(message, object) : console.log(message)
		}
	};

	app.debug = function(message, object) {
		var debug = true;
		if (debug && typeof console !== "undefined") {
			object ? console.log(message, object) : console.log(message)
		}
	}

	app.addRegions({
		headerRegion : '#kakaoHead .wrap_tit',
		snbRegion : '#kakaoHead .menu_side',
		contentRegion : '#kakaoContent',
		footerRegion : '#kakaoFoot',
	});

	app.startSubModule = function(moduleName, options) {
		app.debug("app.startSubModule('" + moduleName + "', options) {");
		var subModule = app.module(moduleName);
		if (app.currentModule === subModule) {
			app.debug("  app.currentModule === app.module('" + moduleName + "')");
			app.debug("} // app.startSubModule('" + moduleName + "', options)");
			return;
		}
		if (app.currentModule) {
			app.currentModule.stop();
		}
		app.currentModule = subModule;
		subModule.start(options);
		app.debug("} // app.startSubModule('" + moduleName + "', options)");
	};

	app.on('initialize:after', function() {
		app.debug("app.on('initialize:after', function() {");

		if (Backbone.history) {
			app.debug("  #before: Backbone.history.start();");
			Backbone.history.start();
			app.debug("  #after: Backbone.history.start();");
		}
		app.debug("} // app.on('initialize:after', function() {...});");
	});

	return app;
});