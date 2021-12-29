define([ 'app'], function(app) {
	app.module('contact', function(contact, app, Backbone, Marionette, $, _) {

		contact.ContactModel = Backbone.Model.extend({
			urlRoot : 'contacts',
			idAttribute : 'id',
			defaults : {
				userID : '',
				fullName : '',
				firstname : '',
				lastname : '',
				nickname : '',
				birth : '',
				organization : '',
				position : '',
				sortNumber : 0,
				notes : '',
				contactExpansions : []
			},
			initialize : function(attributes, options) {
				var contacts = this.get("contactExpansions");
				if (contacts) {
					this.contacts = new contact.ContactCollection(contacts);
					this.unset('contactExpansions');
				}
				Backbone.Model.prototype.initialize.apply(this, arguments);
			}
		});

		contact.ContactCollection = Backbone.Collection.extend({
			url : 'contacts',
			model : contact.ContactModel,
			initialize : function(models, options) {
				Backbone.Collection.prototype.initialize.apply(this, arguments);
			}
		});

		contact.GroupModel = Backbone.Model.extend({
			urlRoot : 'groups',
			idAttribute : 'id',
			defaults : {
				parentID : 0,
				userID : '',
				name : '',
				trash : 0,
				sortNumber : 0
			},
			initialize : function() {
				var groups = this.get("groups");
				if (groups) {
					this.groups = new contact.GroupCollection(groups);
					this.unset('groups');
				}
				Backbone.Model.prototype.initialize.apply(this, arguments);
			}
		});

		contact.GroupCollection = Backbone.Collection.extend({
			url : 'groups',
			model : contact.GroupModel,
			initialize : function(models, options) {
				Backbone.Collection.prototype.initialize.apply(this, arguments);
			},
			findGroupModel : function(attribute, value) {
				return _.find(this.models, function(model) {
					return model.get(attribute) == value;
				});
			}
		});

	});
});