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
                    return (model.has('fullName') && model.get('fullName').indexOf(keyword) > -1) ||
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
            },
            find: function (prop, value) {
                return _.find(this.models, function (model) {
                    return model.get(prop) === value;
                })
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
            csvRecordOptions: {
                'phone': {
                    'home': '집',
                    'company': '직장',
                    'mobile': '휴대폰',
                    'fax': '팩스',
                    'etc': '기타',
                },
                'specialDay': {
                    'anniversary': '기념일',
                    'etc': '기타'
                },
                'sns': {
                    'blog': '블로그',
                    'etc': '기타'
                },
                'address': {
                    'home': '집',
                    'company': '직장',
                    'etc': '기타',
                },
            },
            initialize: function (attributes, options) {
                this.contactExpansionOptions = {
                    phone: _.invert(this.csvRecordOptions['phone']),
                    specialDay: _.invert(this.csvRecordOptions['specialDay']),
                    sns: _.invert(this.csvRecordOptions['sns']),
                    address: _.invert(this.csvRecordOptions['address']),
                };
                var self = this;
                _.each(this.contactExpansionOptions, function (values, key) {
                    self.contactExpansionOptions[key]['default'] = self.contactExpansionOptions[key][_.keys(values)[0]];
                });
                _.each(this.csvRecordOptions, function (values, key) {
                    self.csvRecordOptions[key]['default'] = self.csvRecordOptions[key][_.keys(values)[0]];
                });
                Backbone.Model.prototype.initialize.apply(this, arguments);
            },
            hasProperty: function (prop) {
                return _.has(this.contactExpansionOptions, prop);
            },
            propertyValue: function (prop, optionName) {
                if (!this.hasProperty(prop))
                    return;
                return this.contactExpansionOptions[prop][optionName] || this.contactExpansionOptions[prop]['default'];
            },
            propertyTypeName: function (prop) {
                return prop + 'Type';
            },
            csvOptionValue: function (prop, optionName) {
                if (!_.has(this.csvRecordOptions, prop))
                    return;
                return this.csvRecordOptions[prop][optionName] || this.csvRecordOptions[prop]['default'];
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
            parseCSVRecord: function (model) {
                // model === contact.ContactModel
                var contact = {
                    'Name': model.get('firstname'),
                    'Last Name': model.get('lastname'),
                    'Nickname': model.get('nickname'),
                    'Date of Birth': model.get('birth'),
                    'Company': model.get('organization'),
                    'Title': model.get('position'),
                    'Memo': model.get('notes')
                }
                var optionsHeader = {
                    'email': 'Email',
                    'phone': 'Phone Number',
                    'specialDay': 'Anniversary',
                    'sns': 'SNS',
                    'messenger': 'Messenger',
                    'address': 'Address',
                }

                var self = this;
                _.each(model.get('contactExpansions'), function (expansion, i) {
                    i++;
                    _.each(expansion, function (value, prop) {
                        if (!value || !_.has(optionsHeader, prop))
                            return;
                        var header = optionsHeader[prop] + i;
                        contact[header] = value;
                        if ('email' === prop || 'messenger' === prop) {
                            // nothing to do
                        } else {
                            var optionName = expansion[self.propertyTypeName(prop)];
                            optionName && (contact[header] += ', ' + self.csvOptionValue(prop, optionName));
                        }
                    })
                });
                return contact;
            }
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