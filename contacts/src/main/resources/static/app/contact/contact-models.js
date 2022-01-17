define(['app'], function (app) {
    app.module('contact', function (contact, app, Backbone, Marionette, $, _) {

        contact.ContactModel = Backbone.Model.extend({
            urlRoot: 'contacts',
            idAttribute: 'id',
            defaults: {
                userID: '',
                fullName: '',
                firstname: '',
                lastname: '',
                nickname: '',
                birth: '',
                organization: '',
                position: '',
                sortNumber: 0,
                notes: '',
                contactExpansions: []
            },
            initialize: function (attributes, options) {
                Backbone.Model.prototype.initialize.apply(this, arguments);
            }
        });

        contact.ContactCollection = Backbone.Collection.extend({
            url: 'contacts',
            model: contact.ContactModel,
            initialize: function (models, options) {
                Backbone.Collection.prototype.initialize.apply(this, arguments);
            },
            sort: function (sortField, sortOrder, options) {
                app.debug('contact.ContactCollection.sort(' + sortField + ', ', sortOrder + ')', options);
                if (!sortField)
                    return;
                if (!sortOrder)
                    sortOrder = 'ASC'

                if ('email' === sortField) {
                    this.comparator = (sortOrder === 'ASC') ?
                        function (m1, m2) {
                            try {
                                if (m1.get('contactExpansions')[0][sortField] > m2.get('contactExpansions')[0][sortField]) return 1;
                                if (m2.get('contactExpansions')[0][sortField] > m1.get('contactExpansions')[0][sortField]) return -1;
                            } catch (e) {
                            }
                            return 0;
                        } :
                        function (m1, m2) {
                            try {
                                if (m1.get('contactExpansions')[0][sortField] > m2.get('contactExpansions')[0][sortField]) return -1;
                                if (m2.get('contactExpansions')[0][sortField] > m1.get('contactExpansions')[0][sortField]) return 1;
                            } catch (e) {
                            }
                            return 0;
                        };
                } else {
                    this.comparator = (sortOrder === 'ASC') ?
                        function (m1, m2) {
                            if (m1.get(sortField) > m2.get(sortField)) return 1;
                            if (m2.get(sortField) > m1.get(sortField)) return -1;
                            return 0;
                        } :
                        function (m1, m2) {
                            if (m1.get(sortField) > m2.get(sortField)) return -1;
                            if (m2.get(sortField) > m1.get(sortField)) return 1;
                            return 0;
                        };
                }
                Backbone.Collection.prototype.sort.apply(this, options);
            },
            search: function (keyword) {
                return _.filter(this.models, function (model) {
                    return model.get('fullName').indexOf(keyword) > -1 ||
                        function () {
                            var expansions = model.get('contactExpansions');
                            for (var i = 0; i < expansions.length; i++) {
                                if ((expansions[i].email && expansions[i].email.indexOf(keyword) > -1) ||
                                    (expansions[i].phone && expansions[i].phone.indexOf(keyword) > -1))
                                    return true;
                            }
                            return false;
                        }();
                });
            }
        });

        contact.CSVModel = Backbone.Model.extend({
            urlRoot: 'contacts',
            defaults: function () {
                return {
                    contacts: [],
                    pause: false,
                    fetchCount: 20,
                }
            },
            contactExpansionOptions: {
                'phone': {
                    'default': 'home',
                    '집': 'home',
                    '직장': 'company',
                    '휴대폰': 'mobile',
                    '팩스': 'fax',
                    '기타': 'etc',

                },
                'specialDay': {
                    'default': 'anniversary',
                    '기념일': 'anniversary',
                    '기타': 'etc'
                },
                'sns': {
                    'default': 'blog',
                    '블로그': 'blog',
                    '기타': 'etc'
                },
                'address': {
                    'default': 'home',
                    '집': 'home',
                    '직장': 'company',
                    '기타': 'etc'
                },
            },
            initialize: function (attributes, options) {
                Backbone.Model.prototype.initialize.apply(this, arguments);
                this.pause = false;
            },
            hasOption: function (prop) {
                return _.has(this.contactExpansionOptions, prop);
            },
            optionValue: function (prop, value) {
                return this.contactExpansionOptions[prop][value] || this.contactExpansionOptions[prop]['default'];
            },
            optionName: function (prop) {
                return prop + 'Type';
            },
            clear: function (options) {
                Backbone.Model.prototype.clear.apply(this, options);
            },
            parseHeader: function (rowHeader) {
                return _.map(rowHeader, function (header) {
                    if ('Name' === header)
                        return 'firstname'
                    else if ('Last Name' === header)
                        return 'lastname'
                    else if ('Nickname' === header)
                        return 'nickname'
                    else if ('Date of Birth' === header)
                        return 'birth'
                    else if ('Company' === header)
                        return 'organization'
                    else if ('Title' === header)
                        return 'position'
                    else if ('Memo' === header)
                        return 'notes'
                    else if (header.indexOf('Email') > -1)
                        return 'email'
                    else if (header.indexOf('Phone Number') > -1)
                        return 'phone'
                    else if (header.indexOf('Anniversary') > -1)
                        return 'specialDay'
                    else if (header.indexOf('SNS') > -1)
                        return 'sns'
                    else if (header.indexOf('Messenger') > -1)
                        return 'messenger'
                    else if (header.indexOf('Address') > -1)
                        return 'address'
                    else
                        return header;
                });
            },
        });

        contact.GroupModel = Backbone.Model.extend({
            urlRoot: 'groups',
            idAttribute: 'id',
            defaults: {
                userID: '',
                name: '',
                groupType: 0,
                sortNumber: 0
            },
            initialize: function () {
                Backbone.Model.prototype.initialize.apply(this, arguments);
            }
        });

        contact.GroupCollection = Backbone.Collection.extend({
            url: 'groups',
            model: contact.GroupModel,
            initialize: function (models, options) {
                Backbone.Collection.prototype.initialize.apply(this, arguments);
            },
            findGroupModel: function (attribute, value) {
                return _.find(this.models, function (model) {
                    return model.get(attribute) == value;
                });
            }
        });

    });
});