define(['app', 'text!app/contact/contact-template.html', 'app/contact/contact-models'], function (app, template) {
    app.module('contact', function (contact, app, Backbone, Marionette, $, _) {
        contact.$template = $(template);

        contact.SidebarView = Backbone.Marionette.Layout.extend({
            initialize: function () {
                this.listenTo(app.vent, 'fetch:group-collection', function () {
                    this.listenToOnce(contact.groupCollection, 'sync', this.showGroups);
                    contact.groupCollection.fetch();
                });
                app.vent.trigger('fetch:group-collection');
                this.listenTo(app.vent, 'fetch:contact-count', this.getContactCount);
                this.listenTo(app.vent, 'show:group-layer', this.showGroupLayer);
                this.listenTo(app.vent, 'show:group-remove-layer', this.showGroupRemoveLayer);
                this.listenTo(app.vent, 'show:alert-layer', this.showAlertLayer);
                this.listenTo(app.vent, 'show:confirm-layer', this.showConfirmLayer);
                this.listenTo(app.vent, 'show:toast-layer', this.showToastLayer);
                this.listenTo(app.vent, 'show:toast-footer-layer', this.showToastFooterLayer);
            },
            template: function () {
                var html, compiledTemplate = contact.SidebarView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#sidebar-template').html();
                    compiledTemplate = _.template(html);
                    contact.SidebarView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate();
                return html;
            },
            regions: {
                groupRegion: 'div#groupRegion',
                groupLayerRegion: 'div#groupLayerRegion',
                alertLayerRegion: 'div#alertLayerRegion',
                toastLayerRegion: 'div#toastLayerRegion',
                toastFooterLayerRegion: 'div#toastFooterLayerRegion',
                groupRemoveLayerRegion: 'div#groupRemoveLayerRegion'
            },
            onRender: function () {
                app.vent.trigger('fetch:contact-count', ['all', 'important', 'recently']);

                this.$el.find('button.btn_new:first').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.vent.trigger('show:group-layer');
                });

                var $items = this.$el.find('ul.list_menu:first li');
                $items.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    $items.removeClass('item_current');
                    var $this = $(this);
                    $this.addClass('item_current');
                    location.hash = ('#' + $this.find('a.link_menu').attr('href') || '');
                });

                this.$el.find('button.btn_add').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.vent.trigger('show:contact-edit-layer');
                });
            },
            showGroups: function () {
                var groupView = new contact.GroupTreeRootView({
                    collection: contact.groupCollection
                });
                this.groupRegion.show(groupView);
            },
            showGroupLayer: function (groupModel) {
                var model = groupModel ? groupModel : new contact.GroupModel()
                var groupLayerView = new contact.GroupLayerView({
                    model: new Backbone.Model({
                        groupModel: model,
                        isNew: model.isNew()
                    })
                });
                this.groupLayerRegion.show(groupLayerView);
                groupLayerView.$el.appendTo(app.rootElement);
            },
            showGroupRemoveLayer: function (groupModel) {
                var groupRemoveLayerView = new contact.GroupRemoveLayerView({
                    model: groupModel
                });
                this.groupRemoveLayerRegion.show(groupRemoveLayerView);
                groupRemoveLayerView.$el.appendTo(app.rootElement);
            },
            showAlertLayer: function (attributes) {
                var alertLayerView = new contact.AlertLayerView({
                    model: new Backbone.Model(attributes)
                });
                this.alertLayerRegion.show(alertLayerView);
                alertLayerView.$el.appendTo(app.rootElement);
            },
            showConfirmLayer: function (attributes) {
                var confirmLayerView = new contact.ConfirmLayerView({
                    model: new Backbone.Model(attributes)
                });
                this.alertLayerRegion.show(confirmLayerView);
                confirmLayerView.$el.appendTo(app.rootElement);
            },
            showToastLayer: function (attributes) {
                var toastLayerView = new contact.ToastLayerView({
                    model: new Backbone.Model(attributes)
                });
                this.toastLayerRegion.show(toastLayerView);
                toastLayerView.$el.appendTo(app.rootElement);
            },
            showToastFooterLayer: function (attributes) {
                var toastFooterLayerView = new contact.ToastFooterLayerView({
                    model: new Backbone.Model(attributes)
                });
                this.toastFooterLayerRegion.show(toastFooterLayerView);
                toastFooterLayerView.$el.appendTo(app.rootElement);
            },
            getContactCount: function (condition, params) {
                if (!condition)
                    return false;
                var self = this;

                if (params && _.size(params) > 0) {
                    _.each(condition, function (name) {
                        var value = parseInt(params[name])
                        if (_.isNaN(value))
                            return;
                        var $el = self.$el.find('#' + name + ' span.num_count');
                        $el.text(parseInt($el.text()) + value);
                    })
                    return false;
                }

                new Backbone.Model().fetch({
                    url: 'groups/count',
                    data: $.param({'condition': condition}),
                    success: function (model, response, xhr) {
                        if (model.has('all'))
                            self.$el.find('#all span.num_count').text(model.get('all'));
                        if (model.has('important'))
                            self.$el.find('#important span.num_count').text(model.get('important'));
                        if (model.has('recently'))
                            self.$el.find('#recently span.num_count').text(model.get('recently'));
                    }
                });
            }
        });

        contact.GroupTreeView = Backbone.Marionette.ItemView.extend({
            tagName: 'li',
            className: 'group_tree',
            attributes: {
                style: 'border-top: 0px; padding: 0px'
            },
            initialize: function () {
                this.collection = this.model.groups;
                this.listenTo(this.model, 'sync', this.render);
            },
            template: function (data) {
                var html, compiledTemplate = contact.GroupTreeView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#group-item-template').html();
                    compiledTemplate = _.template(html);
                    contact.GroupTreeView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    group: data
                });
                return html;
            },
            onRender: function () {
                var self = this;
                this.$el.data('id', this.model.id);
                this.$el.find('button.btn_modify').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.vent.trigger('show:group-layer', self.model);
                });

                this.$el.find('button.btn_del').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.vent.trigger('show:group-remove-layer', self.model);
                });

                this.$el.find('a.link_menu').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    location.hash = '#' + $(this).attr('href');
                });
            },
            onClose: function () {

            }
        });

        contact.GroupTreeRootView = Backbone.Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'list_menu list_group',
            attributes: {
                style: 'cursor: pointer;'
            },
            itemView: contact.GroupTreeView,
            initialize: function () {

            },
            onRender: function () {
                var self = this;
                this.$el.sortable({
                    stop: function () {
                        var idList = _.map(self.$el.find('li.group_tree'), function (group) {
                            return $(group).data('id');
                        });

                        if (_.size(idList) === 0)
                            return;

                        new Backbone.Model({
                            id: 0
                        }).save({
                            idList: idList
                        }, {
                            url: 'groups/order',
                            patch: true
                        });

                    }
                });
            }
        });

        contact.GroupLayerView = Backbone.Marionette.ItemView.extend({
            className: 'layer_alert',
            attributes: {
                style: "z-index: 10001;"
            },
            initialize: function () {
                this.groupModel = this.model.get('groupModel');
            },
            template: function (data) {
                var html, compiledTemplate = contact.GroupLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#group-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.GroupLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    group: data.groupModel.toJSON(),
                    isNew: data.isNew
                });
                return html;
            },
            onRender: function () {
                var self = this;

                var $groupName = this.$el.find('input#tfNewGroup');
                var $box = $groupName.closest('div.box_tf');
                $groupName.focus(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    if (!$box.hasClass('box_focus'))
                        $box.addClass('box_focus');
                });
                $groupName.focusout(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    if ($box.hasClass('box_focus'))
                        $box.removeClass('box_focus');
                });

                // Problems with trying to use .focus() in an event handler
                // usually stem from the event being handled also having an affect on focus.
                // To get around that, I usually just wrap the .focus() call in a timeout
                setTimeout(function () {
                    var groupName = $groupName.val();
                    $groupName.focus().val('').val(groupName);
                }, 1)

                var $closeButton = this.$el.find('button.btn_close').add(this.$el.find('button.btn_type1'));
                $closeButton.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.close();
                });

                this.$el.find('button.btn_type2').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var groupName = $groupName.val().trim();
                    if (!groupName) {
                        app.vent.trigger('show:alert-layer', {
                            messages: ['???????????? ??????????????????.']
                        });
                        return false;
                    }

                    if (contact.groupCollection.findGroupModel('name', groupName)) {
                        app.vent.trigger('show:alert-layer', {
                            messages: ['???????????? ????????? ???????????? ???????????????.']
                        });
                        return false;
                    }
                    var isNew = self.groupModel.isNew();
                    var options = {
                        success: function (model, response, xhr) {
                            $closeButton.click();
                            app.vent.trigger('show:toast-layer', {
                                message: isNew ? '????????? ?????????????????????.' : '???????????? ?????????????????????.'
                            });

                            if (!isNew)
                                app.vent.trigger('update:group-name', model);
                        }
                    }
                    var attributes = {
                        name: groupName
                    }
                    if (isNew) {
                        var lastModel = _.last(contact.groupCollection.models);
                        attributes['sortNumber'] = lastModel ? lastModel.get('sortNumber') + 1 : 0;
                    }

                    if (!isNew)
                        options['patch'] = true;

                    self.groupModel.set(attributes);
                    contact.groupCollection.create(self.groupModel, options);
                });
            },
            onShow: function () {
                app.dimmedLayer.showDimmed();
            },
            onClose: function () {
                app.dimmedLayer.hideDimmed();
            }
        });

        contact.GroupRemoveLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html, compiledTemplate = contact.GroupRemoveLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#group-remove-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.GroupRemoveLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    data: data,
                });
                return html;
            },
            onRender: function () {
                var self = this;
                var $closeButtons = this.$el.find('button.btn_close').add(this.$el.find('button.btn_type1'));
                $closeButtons.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.close();
                });

                this.$el.find('button.btn_type2').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var mode = self.$el.find('input[name=inpDelGroup]:checked').val();
                    self.model.destroy({
                        url: self.model.url() + '?mode=' + mode,
                        wait: true,
                        success: function (model, response, xhr) {
                            app.vent.trigger('show:toast-layer', {
                                message: '????????? ????????? ?????????????????????.'
                            });
                            app.vent.trigger('fetch:contact-count', ['all', 'important', 'recently']);
                            if ('all' === mode)
                                app.vent.trigger('fetch:group-collection');

                            if (response) {
                                if (_.size(response.contactIDList) > 0)
                                    app.vent.trigger('remove:contacts-at-group', response.contactIDList);
                            }
                        },
                        complete: function () {
                            self.close();
                        }
                    });
                });
            },
            onShow: function () {
                app.dimmedLayer.showDimmed();
            },
            onClose: function () {
                app.dimmedLayer.hideDimmed();
            }
        });

        contact.ConfirmLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html, compiledTemplate = contact.ConfirmLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#confirm-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.ConfirmLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    data: data,
                });
                return html;
            },
            onRender: function () {
                var self = this;
                var $closeButtons = this.$el.find('button.btn_close').add(this.$el.find('button.btn_type1'));
                $closeButtons.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    if ('move-to-trash' === self.model.get('action')) {
                        if (_.isFunction(self.model.get('cancel')))
                            self.model.get('cancel')();
                    } else if ('contact-import-loading' === self.model.get('action')) {
                        if (_.isFunction(self.model.get('cancel')))
                            self.model.get('cancel')();
                    }
                    self.close();
                });

                var $confirmButton = this.$el.find('button.btn_type2');
                $confirmButton.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.close();
                    if ('move-to-trash' === self.model.get('action')) {
                        if (_.isFunction(self.model.get('confirm')))
                            self.model.get('confirm')();
                    } else if ('contact-import-loading' === self.model.get('action')) {
                        if (_.isFunction(self.model.get('confirm')))
                            self.model.get('confirm')();
                    }
                });
            }
        });

        contact.AlertLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html, compiledTemplate = contact.AlertLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#alert-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.AlertLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    data: data,
                });
                return html;
            },
            onRender: function () {
                var self = this;
                var $closeButtons = this.$el.find('button.btn_close').add(this.$el.find('button.btn_type2'));
                $closeButtons.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    if (_.isFunction(self.model.get('callback')))
                        self.model.get('callback')();
                    self.close();
                });
            }
        });

        contact.ToastLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html, compiledTemplate = contact.ToastLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#toast-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.ToastLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    data: data,
                });
                return html;
            },
            onRender: function () {
                var self = this;
                this.$el.find('button.btn_close').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.close();
                });

                setTimeout(function () {
                    self.close();
                }, 3000);
            }
        });

        contact.ToastFooterLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html, compiledTemplate = contact.ToastFooterLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#toast-footer-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.ToastFooterLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    data: data,
                });
                return html;
            },
            onRender: function () {
                var self = this;
                this.$el.find('button.btn_close').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.close();
                });

                setTimeout(function () {
                    self.close();
                }, 5000);
            }
        });

        contact.GroupSettingsLayer = Backbone.Marionette.ItemView.extend({
            id: 'group_settings',
            className: 'layer_g layer_type3',
            attributes: {
                style: 'user-select: none;z-index:9999;'
            },
            template: function (data) {
                var html, compiledTemplate = contact.GroupSettingsLayer.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#group-settings-template').html();
                    compiledTemplate = _.template(html);
                    contact.GroupSettingsLayer.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    groupCollection: data.groupCollection,
                    contactModels: data.contactModels,
                    part: data.part
                });
                return html;
            },
            initialize: function () {
                this.groupCollection = this.model.get('groupCollection');
                this.contactModels = this.model.get('contactModels');
                this.listenTo(this.groupCollection, 'add', function (model) {
                    this.listenToOnce(model, 'sync', function () {
                        this.render();
                        this.$el.find('input#inpToolGroup' + model.id).prop('checked', true);
                    })
                });
            },
            onRender: function () {
                var self = this;
                var $items = this.$el.find('input.inp_chk');
                $items.change(function (event) {
                    event.stopPropagation();
                    self.changed = true;
                })

                this.$el.find('button.save').click(function (event) {
                    event.preventDefault && event.stopPropagation();
                    var groupIDList = _.map($items.filter(':checked'), function (box) {
                        return parseInt(box.value)
                    });

                    var params = {
                        groupIDList: groupIDList,
                        contactIDList: _.map(self.contactModels, 'id')
                    }
                    new Backbone.Model({id: 0}).save(params, {
                        url: 'contacts/move',
                        success: function () {
                            var part = self.model.get('part');
                            app.vent.trigger('show:toast-layer', {
                                message: part === 'trash' ?
                                    '???????????? ?????????????????????.' :
                                    '?????? ????????? ?????????????????????.'
                            });
                            params['part'] = part;
                            app.vent.trigger('sync:contact-groups-information', params);
                            self.close();
                        }
                    });
                });

                this.$el.find('button.btn_new').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.vent.trigger('show:group-layer');
                });
            },
            onShow: function () {
                var self = this;
                $(app.rootElement).on('click', function (event) {
                    event.stopPropagation()
                    var $eventTarget = $(event.target);
                    if ($eventTarget.closest('#group_settings').length > 0)
                        return;
                    else if ($eventTarget.closest('.layer_alert').length > 0)
                        return;
                    else if ($eventTarget.hasClass('ico_group2'))
                        return;
                    $(app.rootElement).off('click');
                    self.close();
                })
            }
        });

        contact.ContactListSearchView = Backbone.Marionette.Layout.extend({
            className: 'addressbook_head',
            attributes: {
                style: "min-width: initial;"
            },
            regions: {
                groupSettingsLayerRegion: '#groupSettingsLayerRegion',
                sortLayerRegion: '#sortLayerRegion'
            },
            template: function (data) {
                var html, compiledTemplate = contact.ContactListSearchView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#contact-list-search-template').html();
                    compiledTemplate = _.template(html);
                    contact.ContactListSearchView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    part: data.part
                });
                return html;
            },
            initialize: function () {
                this.contactCollection = this.model.get('contactCollection');
                this.part = this.model.get('part');
                this.listenTo(app.vent, 'show:group-settings-layer', this.showGroupSettingsLayer);
            },
            onRender: function () {
                var self = this;
                this.$el.find('#inpChkAll').click(function (event) {
                    event.stopPropagation();
                    app.vent.trigger('select:check-boxes', this.checked);
                });

                var $sortField = this.$el.find('span#sortField');
                var $sortButton = this.$el.find('button.btn_order');
                $sortButton.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var $this = $(this);

                    var sortField = $sortField.data('field');
                    var sortOrder;
                    if ($this.hasClass('reverse_on')) {
                        $this.removeClass('reverse_on')
                        sortOrder = 'DESC'
                    } else {
                        $this.addClass('reverse_on');
                        sortOrder = 'ASC'
                    }
                    self.contactCollection.sort({silent: true}, sortField, sortOrder);
                    app.vent.trigger('show:contact-list', self.contactCollection, self.part);
                });

                this.$el.find('#sort_box_layer').click(function (event) {
                    event.stopPropagation();
                    var $this = $(this);
                    if (!$this.hasClass('box_open')) {
                        $this.addClass('box_open')
                        $('body').one('click', function () {
                            $this.removeClass('box_open')
                        });
                        return false;
                    }
                });

                this.$el.find('input[name=inpSort]').change(function (event) {
                    event.stopPropagation();
                    var $this = $(this);
                    var sortField = $this.val();
                    if ('email' === sortField)
                        $sortField.data('field', sortField);
                    else if ('fullName' === sortField)
                        $sortField.data('field', sortField);
                    $sortField.text($this.next('label').text().trim());
                    $('body').click();
                    self.contactCollection.sort({silent: true}, sortField, 'ASC');
                    app.vent.trigger('show:contact-list', self.contactCollection, self.part);
                });

                var $search = this.$el.find('#tfSearch');
                $search.keyup(_.debounce(function (event) {
                    event.preventDefault && event.stopPropagation();
                    if (!this.value || _.size(this.value.trim()) === 0) {
                        app.vent.trigger('show:contact-list', contact.contactCollection, self.part);
                        return;
                    }
                    var models = self.contactCollection.search(this.value);
                    if (_.size(models) === 0) {
                        app.vent.trigger('show:no-search-result', self.part);
                        return;
                    }
                    app.vent.trigger('show:contact-list', new contact.ContactCollection(models), self.part);
                }, 400));

                this.$el.find('button.btn_search').click(function (event) {
                    event.preventDefault && event.stopPropagation();
                    $search.keyup();
                });

                this.$el.find('button.btn_del').click(function (event) {
                    event.preventDefault && event.stopPropagation();
                    app.vent.trigger('confirm:move-to-trash-contacts');
                });

                this.$el.find('button#move_group').click(function (event) {
                    event.preventDefault && event.stopPropagation();
                    try {
                        app.vent.trigger('aggregate:checked-models');
                    } catch (e) {
                        app.vent.trigger('show:alert-layer', {
                            messages: ['???????????? ??????????????????.']
                        });
                    }
                    return false;
                });
            },
            showGroupSettingsLayer: function (contactModels, part) {
                if (contactModels.length === 0)
                    throw new Error('contacts size is zero')

                this.groupSettingsLayerRegion.show(new contact.GroupSettingsLayer({
                    model: new Backbone.Model({
                        groupCollection: contact.groupCollection,
                        contactModels: contactModels,
                        part: part
                    })
                }));
            }
        });

        contact.ContactListView = Backbone.Marionette.ItemView.extend({
            className: 'addressbook_body',
            template: function (data) {
                var html, compiledTemplate = contact.ContactListView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#contact-list-template').html();
                    compiledTemplate = _.template(html);
                    contact.ContactListView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    contactCollection: data.contactCollection,
                    createGroupsDisplay: contact.ContactListView.createGroupsDisplay,
                    part: data.part,
                    characterMap: app.characterMap
                });
                return html;
            },
            initialize: function () {
                this.contactCollection = this.model.get('contactCollection');
                this.listenTo(app.vent, 'select:check-boxes', function (checked) {
                    _.each(this.$checkBoxes, function (checkBox) {
                        var $checkBox = $(checkBox);
                        $checkBox.prop('checked', checked)
                        var $li = $checkBox.closest('li')
                        if ($checkBox.is(':checked'))
                            !$li.hasClass('item_on') && $li.addClass('item_on')
                        else
                            $li.hasClass('item_on') && $li.removeClass('item_on')
                    })
                });

                this.listenTo(app.vent, 'confirm:move-to-trash-contacts', this.moveToTrash);
                this.listenTo(app.vent, 'aggregate:checked-models', function () {
                    app.debug('aggregate:checked-models');
                    var $checkedBoxes = this.$checkBoxes.filter(':checked');
                    var contactIDList = _.map($checkedBoxes, function (checkedBox) {
                        return parseInt(checkedBox.value);
                    })
                    var models = _.filter(this.contactCollection.models, function (model) {
                        return _.contains(contactIDList, model.id)
                    })
                    // checkedModel in contactCollection || contactGroupCollection || trashCollection
                    app.vent.trigger('show:group-settings-layer', models, this.model.get('part'));
                });
                if (!contact.ContactListView.createGroupsDisplay)
                    contact.ContactListView.createGroupsDisplay = this.createGroupsDisplay;

                this.listenTo(app.vent, 'update:contact-list-important', function (contactID, checked) {
                    var $el = this.$el.find('li[data-id=' + contactID + ']');
                    if ($el.length === 0)
                        return false;
                    $el.find('#inpFav' + contactID).prop('checked', checked);
                })
            },
            createGroupsDisplay: function (groups) {
                var size = _.size(groups)
                if (size === 0)
                    return '';

                var limit = 2;
                var $el = [$('<span/>', {
                    'class': 'ico_bubble',
                    'text': groups[0].name
                })]
                if (size > limit) {
                    $el[0].text($el[0].text() + '??? ' + size + '???');
                    return $el;
                } else if (size > 1) {
                    for (var i = 1; i < size; i++) {
                        if (i > limit)
                            break;
                        $el.push($('<span/>', {
                            'class': 'ico_bubble',
                            'text': groups[i].name
                        }))
                    }
                }
                return $el;
            },
            onRender: function () {
                var self = this;
                this.$checkBoxes = this.$el.find('div.item_profile .inp_chk');
                this.$checkBoxes.click(function (event) {
                    event.stopPropagation();
                    var $this = $(this);
                    var $li = $this.closest('li');

                    if ($this.is(':checked'))
                        !$li.hasClass('item_on') && $li.addClass('item_on')
                    else
                        $li.hasClass('item_on') && $li.removeClass('item_on')
                })

                this.$el.find('input[name=inpFav1]').click(function (event) {
                    event.stopPropagation();
                    var contactID = parseInt(this.value);
                    if (_.isNaN(contactID)) {
                        event.preventDefault();
                        return false;
                    }
                    try {
                        app.vent.trigger('update:important', contactID, this.checked ? 1 : 0);
                    } catch (e) {
                        event.preventDefault();
                        return false;
                    }
                });

                this.$el.find('li').click(function (event) {
                    var $eventTarget = $(event.target);
                    if ($eventTarget.hasClass('ico_fav') ||
                        $eventTarget.hasClass('ico_modify') ||
                        $eventTarget.hasClass('ico_group') ||
                        $eventTarget.hasClass('ico_del') ||
                        $eventTarget.hasClass('contact_chk') ||
                        $eventTarget.closest('div.layer_type3').length > 0)
                        return;

                    var id = $(this).data('id');
                    var model = self.contactCollection.find('id', id);
                    if (!model)
                        return;
                    app.vent.trigger('show:contact-layer', model, self.model.get('part'));
                });

                this.$el.find('li').mouseleave(function () {
                    if (self.groupSettingsLayer && !self.groupSettingsLayer.isClosed)
                        self.groupSettingsLayer.close();
                })

                this.$el.find('div.wrap_edit button').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var $this = $(this)
                    var contactID = parseInt($this.val());
                    if (_.isNaN(contactID))
                        return false;
                    var model = self.contactCollection.find('id', contactID);
                    if (!model)
                        return false;

                    if ($this.hasClass('btn_modify')) {
                        app.vent.trigger('show:contact-edit-layer', model);
                    } else if ($this.hasClass('btn_layer')) {
                        var $el = $this.closest('div.wrap_edit');//
                        self.groupSettingsLayer = new contact.GroupSettingsLayer({
                            model: new Backbone.Model({
                                groupCollection: contact.groupCollection,
                                contactModels: [model],
                                part: self.model.get('part')
                            })
                        });
                        self.groupSettingsLayer.render();
                        self.groupSettingsLayer.$el.css({
                            'margin-top': '30px',
                            'margin-left': '-80px'
                        });
                        $el.prepend(self.groupSettingsLayer.$el);
                    } else if ($this.hasClass('btn_del')) {
                        app.dimmedLayer.showDimmed();
                        app.vent.trigger('confirm:move-to-trash-contacts', [contactID]);
                    }
                    return false;
                });
            },
            moveToTrash: function (contactIDList) {
                if (contactIDList && contactIDList.length > 0) {
                    this.model.get('part') === 'trash' ? this.removeContacts(contactIDList) : this.trash(contactIDList)
                    return;
                }

                var $checkedBoxes = this.$checkBoxes.filter(':checked');
                app.dimmedLayer.showDimmed();
                if ($checkedBoxes.length === 0) {
                    app.vent.trigger('show:alert-layer', {
                        messages: ['???????????? ??????????????????.'],
                        callback: function () {
                            app.dimmedLayer.hideDimmed();
                        }
                    });
                    return;
                }
                contactIDList = _.map($checkedBoxes, function (checkedBox) {
                    return parseInt(checkedBox.value);
                })
                if (_.size(contactIDList) === 0) {
                    app.dimmedLayer.hideDimmed();
                    return;
                }
                this.model.get('part') === 'trash' ? this.removeContacts(contactIDList) : this.trash(contactIDList)
            },
            trash: function (contactIDList) {
                var self = this;
                app.vent.trigger('show:confirm-layer', {
                    action: 'move-to-trash',
                    messages: [
                        contactIDList.length + '?????? ???????????? ?????????????????????????',
                        '????????? ???????????? ??????????????? ???????????????.'
                    ],
                    confirm: function () {
                        new Backbone.Model({
                            id: 0
                        }).save({
                            idList: contactIDList
                        }, {
                            url: 'contacts/trash',
                            patch: true,
                            success: function () {
                                app.vent.trigger('move:trash', {
                                    part: self.model.get('part'),
                                    contactIDList: contactIDList
                                });
                            },
                            complete: function () {
                                app.dimmedLayer.hideDimmed();
                                app.vent.trigger('show:toast-layer', {
                                    message: '???????????? ?????????????????????.'
                                });
                            }
                        });
                    },
                    cancel: function () {
                        app.dimmedLayer.hideDimmed();
                    }
                });
            },
            removeContacts: function (contactIDList) {
                app.vent.trigger('show:confirm-layer', {
                    action: 'move-to-trash',
                    messages: [
                        '???????????? ?????? ????????? ??????????????????.',
                        '???????????? ' + contactIDList.length + '?????? ????????? ?????????????????????????'
                    ],
                    head: '????????????',
                    confirm: function () {
                        new Backbone.Model({
                            id: 0
                        }).destroy({
                            url: 'contacts/remove?' + $.param({idList: contactIDList}),
                            wait: true,
                            success: function () {
                                app.vent.trigger('remove:contacts', contactIDList);
                            },
                            complete: function () {
                                app.dimmedLayer.hideDimmed();
                                app.vent.trigger('show:toast-layer', {
                                    message: '???????????? ?????????????????????.'
                                });
                            }
                        });
                    },
                    cancel: function () {
                        app.dimmedLayer.hideDimmed();
                    }
                });
            },
            onClose: function () {
                if (this.groupSettingsLayer && !this.groupSettingsLayer.isClosed)
                    this.groupSettingsLayer.close();
            }
        });

        contact.NoSearchResultView = Backbone.Marionette.ItemView.extend({
            className: 'addressbook_body',
            template: function (data) {
                var html, compiledTemplate = contact.NoSearchResultView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#no-search-result-template').html();
                    compiledTemplate = _.template(html);
                    contact.NoSearchResultView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    part: data.part
                });
                return html;
            },
        });

        contact.WelcomeToContacts = Backbone.Marionette.ItemView.extend({
            className: 'addressbook_body',
            template: function (data) {
                var html, compiledTemplate = contact.WelcomeToContacts.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#welcome-to-contacts-template').html();
                    compiledTemplate = _.template(html);
                    contact.WelcomeToContacts.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    part: data.part
                });
                return html;
            },
        });

        contact.ContactEditLayer = Backbone.Marionette.ItemView.extend({
            className: 'layer_comm layer_type2',
            attributes: {
                style: "user-select: none; z-index:1000"
            },
            template: function (data) {
                var html, compiledTemplate = contact.ContactEditLayer.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#contact-edit-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.ContactEditLayer.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    contact: data.contactModel.toJSON(),
                    isNew: data.isNew,
                    templates: contact.ContactEditLayer.templates,
                    groupCollection: contact.groupCollection
                });
                return html;
            },
            initialize: function () {
                this.contactModel = this.model.get('contactModel');
                this.isNew = this.model.get('isNew');
                this.contactExpansions = this.contactModel.get('contactExpansions');
                if (!contact.ContactEditLayer.templates)
                    contact.ContactEditLayer.templates = {}

                var templates = contact.ContactEditLayer.templates;
                var html;
                if (!_.has(templates, 'email')) {
                    html = contact.$template.filter('#email-input-template').html();
                    templates['email'] = _.template(html);
                }
                if (!_.has(templates, 'phone')) {
                    html = contact.$template.filter('#phone-input-template').html();
                    templates['phone'] = _.template(html);
                }
                if (!_.has(templates, 'specialDay')) {
                    html = contact.$template.filter('#special-day-input-template').html();
                    templates['specialDay'] = _.template(html);
                }
                if (!_.has(templates, 'sns')) {
                    html = contact.$template.filter('#sns-input-template').html();
                    templates['sns'] = _.template(html);
                }
                if (!_.has(templates, 'msg')) {
                    html = contact.$template.filter('#msg-input-template').html();
                    templates['msg'] = _.template(html);
                }
                if (!_.has(templates, 'groupItem')) {
                    html = contact.$template.filter('#contact-layer-group-item-template').html();
                    templates['groupItem'] = _.template(html);
                }

                if (!_.has(templates, 'address')) {
                    html = contact.$template.filter('#address-input-template').html();
                    templates['address'] = _.template(html);
                }
            },
            onRender: function () {
                var self = this;

                // ?????? ?????? ??????
                this.$el.on('click', 'button.btn_opt', function (event) {
                    event.preventDefault() && event.stopPropagation();

                    // ?????? ????????? ?????? ???????????? ?????? ?????? ?????? ?????? ???, ?????????
                    self.$el.find('div.opt_comm').removeClass('opt_open');

                    // ?????? ?????? ??????
                    var $this = $(this);
                    var $optionBox = $this.closest('div.opt_comm')
                    $optionBox.addClass('opt_open');

                    if (this.value === 'groupSettings') {
                        app.dimmedLayer.showCompositeDimmed(this, 1001);
                        return false;
                    }

                    // ?????? ?????? ?????? ???, ?????????
                    $(app.rootElement).one('click', function (event) {
                        event.preventDefault() && event.stopPropagation();
                        $optionBox.removeClass('opt_open');
                        return false;
                    });
                    return false;
                });

                this.$el.on('click', 'ul.list_chk li.option', function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var $this = $(this);

                    var $radioBox = $this.find('.inp_chk');
                    $radioBox.prop('checked', true);
                    var optionType = $radioBox.val();
                    var displayText = $radioBox.next('label:first').text();

                    var $box = $this.closest('div.box_info');
                    $box.find('span.selected_type').text(displayText);
                    $box.find('div.box_tf input').data('type', optionType)
                    $(app.rootElement).click();
                    return false;
                });

                this.$el.find('ul#contactLayerGroups li.group').click(function (event) {
                    event.stopPropagation();
                });

                var $groupCreateBox = this.$el.find('#groupCreateBox');
                this.$el.find('#showGroupCreateBox').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    $groupCreateBox.show();
                });
                var $groupName = $groupCreateBox.find('#tfWriteGroup');
                $groupName.keyup(_.debounce(function (event) {
                    event.preventDefault && event.stopPropagation();
                    var models = contact.groupCollection.findGroupModel('name', this.value)
                    if (models) {
                        if ($groupCreateBox.find('p.desc_error').length === 0)
                            $groupCreateBox.append($('<p class="desc_error">????????? ??????????????????.</p>'));
                    } else {
                        $groupCreateBox.find('p.desc_error').remove();
                    }
                }, 100));

                $groupCreateBox.find('button.btn_add').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var groupName = $groupName.val().trim();
                    if (!groupName) {
                        var zIndex = 1002;
                        app.dimmedLayer.showCompositeDimmed(this, zIndex);
                        app.vent.trigger('show:alert-layer', {
                            messages: ['???????????? ??????????????????.'],
                            callback: function () {
                                app.dimmedLayer.closeCompositeDimmed(zIndex);
                            }
                        });
                        return false;
                    }

                    var groupModel = new contact.GroupModel({
                        name: groupName,
                        sortNumber: _.last(contact.groupCollection.models).get('sortNumber') + 1
                    });
                    contact.groupCollection.create(groupModel, {
                        success: function (model, response, xhr) {
                            var $groups = self.$el.find('ul#contactLayerGroups');
                            var html = contact.ContactEditLayer.templates['groupItem'] ({
                                groups : contact.groupCollection.models,
                                groupModel: model
                            });
                            $groups.append(html);
                            $groups.find('#inpWriteGroup' + model.id).prop('checked', true);
                            app.vent.trigger('show:toast-layer', {
                                message: '????????? ?????????????????????.'
                            });
                        }
                    });
                });

                this.$el.find('button.group_save').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.dimmedLayer.closeCompositeDimmed(1001);

                    var $checkedBoxes = self.$el.find('input[name=inpWriteGroup]:checked');
                    var models = _.map($checkedBoxes, function (box) {
                        return contact.groupCollection.findGroupModel('id', box.value).get('name')
                    });
                    var names = models.length > 0 ? models.join(',') : '????????????';
                    self.$el.find('span.group_names').text(names);

                    $(this).closest('div.opt_comm').removeClass('opt_open');
                    $groupCreateBox.hide();
                    return false;
                });

                this.$el.find('button.btn_addition').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var $mails = self.$el.find('input[name=tfWriteMail2]')
                    var $phones = self.$el.find('input[name=tfWritePhone]')
                    var $days = self.$el.find('input[name=tfWriteDay]')
                    var $sns = self.$el.find('input[name=tfWriteLink]')
                    var $messengers = self.$el.find('input[name=tfWriteMsn]')
                    var $locations = self.$el.find('input[name=tfWriteLocation]')

                    if (($mails.length + $phones.length + $days.length +
                        $sns.length + $messengers.length + $locations.length) >= 30) {
                        app.dimmedLayer.closeCompositeDimmed(1001);
                        app.vent.trigger('show:alert-layer', {
                            messages: ['?????? ????????? ?????????/????????????/?????????/SNS/?????????/?????? ?????? ????????? 30???????????? ???????????????.'],
                            callback: function () {
                                app.dimmedLayer.hideDimmed();
                            }
                        });
                    }
                    self.appendInputRegion(this.value);
                });

                // ??????
                var $saveButton = this.$el.find('button.btn_type2');
                $saveButton.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var firstname = self.$el.find('#tfWriteFirstName').val().trim();
                    if (!firstname) {
                        app.dimmedLayer.showCompositeDimmed(this, 1001)
                        app.vent.trigger('show:alert-layer', {
                            messages: ['????????? ????????? ?????????.'],
                            callback: function () {
                                app.dimmedLayer.closeCompositeDimmed(1001);
                            }
                        });
                        return false;
                    }
                    var lastname = self.$el.find('#tfWriteLastName').val().trim();
                    var contactFields = {
                        firstname: firstname,
                        lastname: lastname,
                        fullName: lastname ? (lastname + firstname) : firstname,
                        important: self.$el.find('#inpWriteFav').is(':checked') ? 1 : 0,
                        nickname: self.$el.find('#tfWriteNick').val().trim(),
                        organization: self.$el.find('#tfWriteOffice').val().trim(),
                        position: self.$el.find('#tfWriteClass').val().trim(),
                        notes: self.$el.find('#tfWritMemo').val().trim(),
                        contactExpansions: []
                    };
                    app.debug('contactFields: ', contactFields);

                    var reject = function ($el) {
                        return _.reject($el, function (el) {
                            return !el.value.trim()
                        })
                    }
                    var $emailList = reject(self.$el.find('input[name=tfWriteMail2]')); // email
                    var $messengerList = reject(self.$el.find('input[name=tfWriteMsn]')); // messenger
                    var $phoneList = reject(self.$el.find('input[name=tfWritePhone]')); // phone
                    var $specialDayList = reject(self.$el.find('input[name=tfWriteDay]')); // specialDay
                    var $snsList = reject(self.$el.find('input[name=tfWriteLink]')); // sns
                    var $addressList = reject(self.$el.find('input[name=tfWriteLocation]')); // address
                    var expansions = [$emailList, $messengerList, $phoneList, $specialDayList, $snsList, $addressList];
                    var maxLength = _.max(expansions, 'length').length || 0;
                    for (var i = 0; i < maxLength; i++) {
                        var expansion = {}
                        if (!self.contactModel.isNew())
                            expansion['contactID'] = self.contactModel.id;

                        $emailList[i] && (expansion['email'] = $emailList[i].value.trim());
                        $messengerList[i] && (expansion['messenger'] = $messengerList[i].value.trim());
                        if ($phoneList[i]) {
                            var phone = $phoneList[i];
                            expansion['phone'] = phone.value.trim();
                            expansion['phoneType'] = expansion['phone'] ? $(phone).data('type') : '';
                        }
                        if ($specialDayList[i]) {
                            var specialDay = $specialDayList[i];
                            expansion['specialDay'] = specialDay.value.trim();
                            expansion['specialDayType'] = expansion['specialDay'] ? $(specialDay).data('type') : '';
                        }
                        if ($snsList[i]) {
                            var sns = $snsList[i];
                            expansion['sns'] = sns.value.trim();
                            expansion['snsType'] = expansion['sns'] ? $(sns).data('type') : '';
                        }
                        if ($addressList[i]) {
                            var address = $addressList[i];
                            expansion['address'] = address.value.trim();
                            expansion['addressType'] = expansion['address'] ? $(address).data('type') : '';
                        }
                        contactFields.contactExpansions.push(expansion);
                    }
                    contactFields['groups'] = _.compact(
                        _.map(self.$el.find('input[name=inpWriteGroup]').filter(':checked'), function (group) {
                            return {id: parseInt(group.value)};
                        })
                    );
                    app.debug('contactFields.contactExpansions', contactFields.contactExpansions);
                    app.debug('this.model', self.contactModel);


                    // POST or PUT
                    self.contactModel.save(contactFields, {
                        success: function (model, response, xhr) {
                            app.vent.trigger('fetch:group-collection');
                            if (self.isNew)
                                app.vent.trigger('create:contact', model);
                            self.close();
                            location.hash = location.hash + '?_=' + new Date().getTime();
                        }
                    });
                });

                // ??????, ??????
                var $closeButton = this.$el.find('button#contactLayerClose').add(this.$el.find('button#contactLayerCancel'));
                $closeButton.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.close();
                });

                // ?????????
                var $moreButton = this.$el.find('button.btn_more');
                $moreButton.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.$el.find('div.bundle_address').addClass('bundle_open');
                    $(this).hide();
                })
                //$moreButton.click();
            },
            appendInputRegion: function (epicenter) {
                var templates = contact.ContactEditLayer.templates;
                if (_.has(templates, epicenter)) {
                    var $inputs = this.$el.find('.info_address[data-epicenter=' + epicenter + ']');
                    var $html = $(templates[epicenter]({
                        contactExpansion: {},
                        index: $inputs.length
                    }));
                    $(_.last($inputs)).after($html);
                    $html.find('input:text')[0].focus();
                }
            },
            onShow: function () {
                app.dimmedLayer.showDimmed();
            },
            onClose: function () {
                app.dimmedLayer.hideDimmed();
            }
        });

        contact.ContactLayer = Backbone.Marionette.Layout.extend({
            className: 'layer_comm layer_address',
            template: function (data) {
                var html, compiledTemplate = contact.ContactLayer.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#contact-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.ContactLayer.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    contact: data.contactModel.toJSON(),
                    part: data.part
                });
                return html;
            },
            regions: {
                groupSettingsLayerRegion: 'div.group_settings_layer_region'
            },
            initialize: function () {
                this.contactModel = this.model.get('contactModel');
            },
            onRender: function () {
                var self = this;

                $('div.dimm_layer').click(function () {
                    $(this).off();
                    self.close();
                });

                // [????????????]
                this.$el.find('#inpViewFav').click(function (event) {
                    event.stopPropagation();
                    var contactID = parseInt(this.value);
                    if (_.isNaN(contactID)) {
                        event.preventDefault();
                        return false;
                    }
                    try {
                        app.vent.trigger('update:important', contactID, this.checked ? 1 : 0);
                        app.vent.trigger('update:contact-list-important', contactID, this.checked);
                    } catch (e) {
                        event.preventDefault();
                        return false;
                    }
                });

                // [??????]
                this.$el.find('button.btn_close').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    self.close();
                });

                // ?????? [??????] [????????????] [??????] ?????????
                this.$el.find('div.wrap_edit button.btn_edit').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    var $this = $(this);
                    if ($this.hasClass('ico_modify2')) {
                        self.close();
                        app.vent.trigger('show:contact-edit-layer', self.contactModel);
                    } else if ($this.hasClass('ico_group2')) {
                        var groupSettingsLayer = new contact.GroupSettingsLayer({
                            model: new Backbone.Model({
                                groupCollection: contact.groupCollection,
                                contactModels: [self.contactModel],
                                part: self.model.get('part')
                            })
                        });
                        self.groupSettingsLayerRegion.show(groupSettingsLayer);
                        groupSettingsLayer.$el.attr('class', 'layer_g layer_group layer_type3');
                        groupSettingsLayer.$el.find('button.btn_close').css({
                            'top': '10px',
                            'right': '12px'
                        });
                        app.dimmedLayer.showCompositeDimmed(this, 1001);
                        self.listenToOnce(groupSettingsLayer, 'close', function () {
                            app.dimmedLayer.closeCompositeDimmed(1001);
                        });
                    } else if ($this.hasClass('ico_del2')) {
                        app.vent.trigger('confirm:move-to-trash-contacts', [self.contactModel.id]);
                    }
                });


            },
            onShow: function () {
                app.dimmedLayer.showDimmed();
            },
            onClose: function () {
                app.dimmedLayer.hideDimmed();
            }
        });

        contact.ContentLayout = Backbone.Marionette.Layout.extend({
            tagName: 'article',
            attributes: {
                id: 'mArticle'
            },
            template: function () {
                var html, compiledTemplate = contact.ContentLayout.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#content-layout-template').html();
                    compiledTemplate = _.template(html);
                    contact.ContentLayout.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({});
                return html;
            },
            regions: {
                contactListSearchRegion: 'div#contactListSearchRegion',
                contactListRegion: 'div#contactListRegion',
                trashRegion: 'div#trashRegion',
                contactSimpleLayerRegion: 'div#contactLayerRegion',
                contactLayerRegion: 'div#contactLayerRegion',
                contactEditLayerRegion: 'div#contactEditLayerRegion',
                importHeaderRegion: 'div#importHeaderRegion',
                importContentRegion: 'div#importContentRegion',
                importLoadingRegion: 'div#importLoadingRegion',
                exportHeaderRegion: 'div#exportHeaderRegion',
                exportContentRegion: 'div#exportContentRegion',
            },
            initialize: function (options) {
                this.contactCollection = options.contactCollection;
                this.listenTo(app.vent, 'show:contact-list', this.showContactList);
                this.listenTo(app.vent, 'show:contact-search', this.showContactSearchRegion);
                this.listenTo(app.vent, 'show:no-search-result', this.showNoSearchResult);
                this.listenTo(app.vent, 'show:welcome-to-contacts', this.showWelcomeToContacts);
                this.listenTo(app.vent, 'show:contact-layer', this.showContactLayer);
                this.listenTo(app.vent, 'show:contact-edit-layer', this.showContactEditLayer);
                this.listenTo(app.vent, 'show:import-loading', this.showImportLoading);
            },
            onRender: function () {
                this.importHeaderRegion.show(new contact.ImportHeaderView());
                this.importHeaderRegion.$el.hide();
                this.importContentRegion.show(new contact.ImportContentView());
                this.importContentRegion.$el.hide();
                this.exportHeaderRegion.show(new contact.ExportHeaderView());
                this.exportHeaderRegion.$el.hide();
                this.exportContentRegion.show(new contact.ExportContentView());
                this.exportContentRegion.$el.hide();
            },
            showContactList: function (contactCollection, part) {
                app.debug('ContentLayout.showContactList( ' + part + ')');
                if (contactCollection.models.length === 0) {
                    app.vent.trigger('show:welcome-to-contacts', part);
                    return;
                }
                var contactListView = new contact.ContactListView({
                    model: new Backbone.Model({
                        contactCollection: contactCollection ? contactCollection : this.contactCollection,
                        part: part
                    })
                });
                this.contactListRegion.show(contactListView);
                contactListView.$el.appendTo('#' + this.attributes.id);
                this.showContactListRegion();
            },
            showContactSearchRegion: function (contactCollection, part) {
                app.debug('ContentLayout.showContactList(contactCollection, ' + part + ')');
                this.contactListSearchRegion.show(new contact.ContactListSearchView({
                    model: new Backbone.Model({
                        contactCollection: contactCollection ? contactCollection : this.contactCollection,
                        part: part
                    })
                }));
            },
            showContactLayer: function (contactModel, part) {
                var contactLayer = new contact.ContactLayer({
                    model: new Backbone.Model({
                        contactModel: contactModel,
                        part: part
                    })
                });
                this.contactLayerRegion.show(contactLayer);
                contactLayer.$el.appendTo(app.rootElement);
            },
            showContactEditLayer: function (contactModel) {
                if (!contactModel)
                    contactModel = new contact.ContactModel();
                var contactEditLayer = new contact.ContactEditLayer({
                    model: new Backbone.Model({
                        contactModel: contactModel,
                        isNew: contactModel.isNew()
                    })
                });
                this.contactEditLayerRegion.show(contactEditLayer);
                contactEditLayer.$el.appendTo(app.rootElement);
            },
            showNoSearchResult: function (part) {
                var noSearchResultView = new contact.NoSearchResultView({
                    model: new Backbone.Model({
                        part: part
                    })
                });
                this.contactListRegion.show(noSearchResultView);
                noSearchResultView.$el.appendTo('#' + this.attributes.id);
            },
            showWelcomeToContacts: function (part) {
                var welcomeToContacts = new contact.WelcomeToContacts({
                    model: new Backbone.Model({
                        part: part
                    })
                });
                this.contactListRegion.show(welcomeToContacts);
                welcomeToContacts.$el.appendTo('#' + this.attributes.id);
            },
            showContactListRegion: function () {
                this.importHeaderRegion.$el.hide();
                this.importContentRegion.$el.hide();
                this.exportHeaderRegion.$el.hide();
                this.exportContentRegion.$el.hide();
                this.contactListSearchRegion.$el.show();
            },
            showImportRegion: function () {
                this.contactListSearchRegion.$el && this.contactListSearchRegion.$el.hide();
                this.contactListRegion.$el && this.contactListRegion.$el.hide();
                this.exportHeaderRegion.$el.hide();
                this.exportContentRegion.$el.hide();
                this.importHeaderRegion.$el.show();
                this.importContentRegion.$el.show();
            },
            showExportRegion: function () {
                this.contactListSearchRegion.$el && this.contactListSearchRegion.$el.hide();
                this.contactListRegion.$el && this.contactListRegion.$el.hide();
                this.importHeaderRegion.$el.hide();
                this.importContentRegion.$el.hide();
                this.exportHeaderRegion.$el.show();
                this.exportContentRegion.$el.show();
            },
            showImportLoading: function (attributes) {
                this.importLoadingRegion.show(new contact.ImportLoadingView({
                    model: new Backbone.Model(attributes)
                }));
            }
        });

        contact.ImportHeaderView = Backbone.Marionette.ItemView.extend({
            className: 'article_head',
            template: function () {
                var html, compiledTemplate = contact.ImportHeaderView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#import-header-template').html();
                    compiledTemplate = _.template(html);
                    contact.ImportHeaderView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate();
                return html;
            },
        });

        contact.ImportLoadingView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html, compiledTemplate = contact.ImportLoadingView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#import-loading-template').html();
                    compiledTemplate = _.template(html);
                    contact.ImportLoadingView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    data: data,
                });
                return html;
            },
            initialize: function () {
                this.listenTo(this.model, 'change', function () {
                    this.$count.text(this.model.get('importCount') + ' / ' + this.model.get('maxCount'));
                })
                this.listenTo(app.vent, 'increment:import-count', function (importCount) {
                    this.model.set('importCount', this.model.get('importCount') + importCount)
                });
                this.listenTo(app.vent, 'complete:import-loading', function () {
                    app.vent.trigger('show:toast-footer-layer', {
                        message: '????????? ??????????????? ?????????????????????.',
                        contact: {
                            importCount: this.model.get('importCount'),
                            maxCount: this.model.get('maxCount')
                        }
                    });
                    this.close();
                });

                this.listenTo(app.vent, 'close:import-loading', function () {
                    this.close();
                });

            },
            onRender: function () {
                var self = this;
                this.$count = this.$el.find('span.desc_loading');
                var $cancel = this.$el.find('button.btn_type1');
                $cancel.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.vent.trigger('pause:import-contact');
                    app.dimmedLayer.showDimmed();
                    app.vent.trigger('show:confirm-layer', {
                        action: 'contact-import-loading',
                        messages: [
                            '????????? ??????????????? ?????????????????????????'
                        ],
                        confirm: function () {
                            app.dimmedLayer.hideDimmed();
                            self.close();
                            app.vent.trigger('stop:import-contact');
                        },
                        cancel: function () {
                            app.vent.trigger('continue:import-contact');
                            app.dimmedLayer.hideDimmed();
                        }
                    });
                });
            }
        });

        contact.ImportContentView = Backbone.Marionette.ItemView.extend({
            initialize: function () {
                this.csvModel = new contact.CSVModel();
                this.listenTo(app.vent, 'continue:import-contact', function () {
                    this.csvModel.set('pause', false);
                    this.save();
                });
                this.listenTo(app.vent, 'pause:import-contact', function () {
                    this.csvModel.set('pause', true);
                });

                this.listenTo(app.vent, 'stop:import-contact', function () {
                    this.csvModel.clear();
                    this.render();
                    app.vent.trigger('fetch:contact-count', ['all']);
                    app.vent.trigger('paginate:contact-list');
                });

                this.listenTo(app.vent, 'complete:import-contact', function () {
                    app.vent.trigger('fetch:contact-count', ['all']);
                    app.vent.trigger('complete:import-loading');
                    app.vent.trigger('stop:import-contact');
                    app.vent.trigger('paginate:contact-list');
                });

            },
            template: function () {
                var html, compiledTemplate = contact.ImportContentView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#import-content-template').html();
                    compiledTemplate = _.template(html);
                    contact.ImportContentView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate();
                return html;
            },
            onRender: function () {
                var self = this;
                this.$el.find('button#sampleFile').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    location.href = 'contacts/import/sample'
                })

                var $fileName = this.$el.find('span#fileName');
                var $file = this.$el.find('#inpFile');
                $file.change(function (event) {
                    event.stopPropagation();
                    var files = event.target.files;
                    self.file = files[0];
                    $fileName.text(self.file.name);
                });

                this.$el.find('button.btn_comm').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    if (!self.file || (self.file.name !== $fileName.text()))
                        return false;

                    var reader = new FileReader();
                    reader.readAsText(self.file, "EUC-KR");
                    reader.onload = function (event) {
                        var csv = event.target.result;
                        var csvRecords = $.csv.toArrays(csv);
                        if (!csvRecords || csvRecords.length === 0)
                            return false;

                        var csvModel = self.csvModel;
                        csvModel.set(csvModel.defaults(), {silent: true});
                        var contacts = csvModel.get('contacts');
                        var headers = csvModel.parseHeader(csvRecords[0]);
                        _.each(csvRecords, function (record, recordIndex) {
                            if (recordIndex === 0)
                                return; // skipping headers

                            var contactProps = {
                                contactExpansions: []
                            }
                            var expansionProps = {
                                email: [],
                                phone: [],
                                specialDay: [],
                                sns: [],
                                messenger: [],
                                address: []
                            }

                            // bind properties contactProps, expansionProps
                            _.each(headers, function (header, i) {
                                if (header) {
                                    if (_.has(expansionProps, header))
                                        expansionProps[header].push(record[i]);
                                    else
                                        contactProps[header] = record[i];
                                }
                            });
                            contactProps['fullName'] = contactProps['lastname'] + contactProps['firstname'];

                            // Find the maximum array length from expansionProps.
                            var maxLength = _.max(expansionProps, 'length').length || 0;
                            for (var i = 0; i < maxLength; i++) {
                                var expansion = _.object(
                                    _.keys(expansionProps), // ['email', 'phone', 'specialDay' ...]
                                    _.map(expansionProps, _.property(i)) // return email[i], phone[i], specialDay[i]
                                );

                                _.each(expansion, function (value, prop) {
                                    if (value && csvModel.hasProperty(prop)) {
                                        var pivot = value.indexOf(',');
                                        if (pivot > 0) {
                                            var propertyType = csvModel.propertyTypeName(prop);
                                            expansion[propertyType] = csvModel.propertyValue(prop, value.substring(pivot + 1).trim());
                                            value = value.substring(0, pivot).trim();
                                        }
                                    } else {
                                        value = value ? value.trim() : value;
                                    }
                                    expansion[prop] = value;
                                });
                                contactProps.contactExpansions.push(expansion);
                            }
                            contacts.push(contactProps);
                        }); // _.each(csvRecords...

                        self.importContacts();
                    };
                }); // click event
            },
            importContacts: function () {
                var contacts = this.csvModel.get('contacts');
                if (!contacts || contacts.length === 0)
                    return;

                app.vent.trigger('show:import-loading', {
                    importCount: 0,
                    maxCount: contacts.length
                });
                this.save();
            },
            save: function () {
                var contacts = this.csvModel.get('contacts');
                if (this.csvModel.get('pause') || contacts.length === 0)
                    return;

                var buffer = []
                while (buffer.length < this.csvModel.get('fetchCount')) {
                    var item = contacts.shift();
                    if (!item)
                        break;
                    buffer.push(item);
                }

                if (buffer.length === 0)
                    return;

                var self = this;
                new Backbone.Model().save({
                    contacts: buffer
                }, {
                    url: _.result(this.csvModel, 'urlRoot') + '/import',
                    async: false,
                    complete: function () {
                        app.vent.trigger('increment:import-count', buffer.length);
                        if (contacts.length === 0) {
                            app.vent.trigger('complete:import-contact');
                            return;
                        }
                        setTimeout(() => {
                            self.save();
                        }, 100);
                    },
                    error: function () {
                        app.vent.trigger('stop:import-contact');
                        app.vent.trigger('close:import-loading');
                        app.vent.trigger('fetch:contact-count', ['all']);
                        app.vent.trigger('show:alert-layer', {
                            messages: [
                                '????????? ???????????? ??? ????????? ???????????????.',
                                '????????? ???????????? ??????????????? ????????????.'
                            ]
                        });
                    }
                })

            }
        });

        contact.ExportContentView = Backbone.Marionette.ItemView.extend({
            template: function () {
                var html, compiledTemplate = contact.ExportContentView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#export-content-template').html();
                    compiledTemplate = _.template(html);
                    contact.ExportContentView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate();
                return html;
            },
            onRender: function () {
                this.$el.find('button.btn_export').click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    if (contact.contactCollection.models.length === 0)
                        return false;
                    var csvModel = new contact.CSVModel();

                    var _recordHeaders = ['Name', 'Last Name', 'Nickname'];

                    var cache = {};
                    var headers = [];
                    var records = _.map(contact.contactCollection.models, function (model) {
                        var record = csvModel.parseCSVRecord(model);
                        _.each(record, function (value, prop) {
                            if (!_.has(cache, prop)) {
                                cache[prop] = 0;
                                headers.push(prop);
                            }
                        })
                        return csvModel.parseCSVRecord(model)
                    });

                    headers = _.sortBy(headers)
                    _.each(headers, function (header) {
                        header.indexOf('Email') > -1 && _recordHeaders.push(header)
                    });
                    _.each(headers, function (header) {
                        header.indexOf('Phone Number') > -1 && _recordHeaders.push(header)
                    });
                    _recordHeaders.push('Date of Birth');
                    _.each(headers, function (header) {
                        header.indexOf('Anniversary') > -1 && _recordHeaders.push(header)
                    });
                    _.each(headers, function (header) {
                        header.indexOf('SNS') > -1 && _recordHeaders.push(header)
                    });
                    _.each(headers, function (header) {
                        header.indexOf('Messenger') > -1 && _recordHeaders.push(header)
                    });
                    _.each(headers, function (header) {
                        header.indexOf('Address') > -1 && _recordHeaders.push(header)
                    });
                    _recordHeaders.push('Company', 'Title', 'Memo');
                    var blob = new Blob(["\uFEFF" + $.csv.fromObjects(records, {
                        'headers': true,
                        'sortOrder': false,
                        'manualOrder': _recordHeaders
                    })], {
                        type: 'text/csv;charset=utf-8'
                    });

                    var url = URL.createObjectURL(blob);
                    var filename = 'kakaomail_contacts_' + $.datepicker.formatDate('yymmdd', new Date()) + '.csv';
                    var link = document.createElement('a');
                    link.setAttribute('style', 'display:none');
                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click()
                    link.remove();
                });
            }
        });

        contact.ExportHeaderView = Backbone.Marionette.ItemView.extend({
            className: 'article_head',
            template: function () {
                var html, compiledTemplate = contact.ExportHeaderView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#export-header-template').html();
                    compiledTemplate = _.template(html);
                    contact.ExportHeaderView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate();
                return html;
            },
        });
    });
});