(function() {
	require.config({
		baseUrl : './',
		urlArgs : 'v=202112290000', // yyyyMMddHHmm
		paths : {
			text : 'js/lib/text-2.0.14',
			jquery : 'js/lib/jquery-1.11.3',
			underscore : 'js/lib/underscore-1.8.3',
			backbone : 'js/lib/backbone-1.2.3',
			marionette : 'js/lib/backbone.marionette-1.8.8',
			'backbone.routefilter' : 'js/lib/backbone.routefilter-0.2.1',
			'backbone.queryparams' : 'js/lib/backbone.queryparams-0.4.0.custom',
			'jquery.dateFormat' : 'js/lib/jquery-dateFormat-1.0.2',
			'jquery.dateFormat.i18n' : 'js/lib/jquery-dateFormat-1.0.2-i18n'
		},
		shim : {
			backbone : {
				deps : [ 'jquery', 'underscore' ],
				exports : 'Backbone'
			},
			marionette : {
				deps : [ 'jquery', 'underscore', 'backbone' ],
				exports : 'Backbone.Marionette'
			},
			'backbone.routefilter' : {
				deps : [ 'jquery', 'underscore', 'backbone' ]
			},
			'backbone.queryparams' : {
				deps : [ 'jquery', 'underscore', 'backbone' ]
			},
			'jquery.dateFormat' : {
				deps : [ 'jquery' ]
			},
			app : {
				deps : [ 'underscore', 'backbone', 'marionette', 'backbone.routefilter', 'backbone.queryparams' ]
			},
		},
		waitSeconds : 0
	});

	require([ 'backbone' ], function(Backbone) {
		Backbone.emulateHTTP = true;
		Backbone.emulateJSON = true;
	});

	require([ 'jquery', 'app', 'app/app-init'], function($, app) {
		$(function() {
			app.start();
		});
	});
})();
