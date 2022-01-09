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
                    app.vent.trigger('show:contact-layer');
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
            getContactCount: function (condition) {
                if (!condition)
                    return false;

                var self = this;
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
                console.log('GroupTreeView close...');
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
                            messages: ['그룹명을 입력해주세요.']
                        });
                        return false;
                    }

                    if (contact.groupCollection.findGroupModel('name', groupName)) {
                        app.vent.trigger('show:alert-layer', {
                            messages: ['주소록에 동일한 그룹명이 존재합니다.']
                        });
                        return false;
                    }
                    var options = {
                        success: function (model, response, xhr) {
                            $closeButton.click();
                        }
                    }
                    var attributes = {
                        name: groupName
                    }
                    if (self.groupModel.isNew())
                        attributes['sortNumber'] = _.last(contact.groupCollection.models).get('sortNumber') + 1;

                    if (!self.groupModel.isNew())
                        options['patch'] = true;

                    self.groupModel.set(attributes);
                    contact.groupCollection.create(self.groupModel, options);
                });
            },
            onShow: function () {
                app.vent.trigger('show:dimmed');
            },
            onClose: function () {
                app.vent.trigger('hide:dimmed');
            }
        });

        contact.GroupRemoveLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html = contact.$template.filter('#group-remove-layer-template').html();
                var compiledTemplate = _.template(html);
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
                        success: function () {
                            app.vent.trigger('show:toast-layer', {
                                message: '선택한 그룹이 삭제되었습니다.'
                            });
                            app.vent.trigger('fetch:contact-count', ['all', 'important', 'recently']);

                            // 연락처까지 삭제로 인해 영향받은 모든 그룹을 찾아서 연락처 개수를 갱신 시켜줄 수는 없으므로 fetch:
                            if ('all' === mode)
                                app.vent.trigger('fetch:group-collection');
                        },
                        complete: function () {
                            self.close();
                        }
                    });
                });
            },
            onShow: function () {
                app.vent.trigger('show:dimmed');
            },
            onClose: function () {
                app.vent.trigger('hide:dimmed');
            }
        });

        contact.ConfirmLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html = contact.$template.filter('#confirm-layer-template').html();
                var compiledTemplate = _.template(html);
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
                    if ('move-to-trash' === self.model.get('action')) {
                        if (_.isFunction(self.model.get('callback')))
                            self.model.get('callback')();
                    }
                    self.close();
                });
            }
        });

        contact.AlertLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html = contact.$template.filter('#alert-layer-template').html();
                var compiledTemplate = _.template(html);
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
                    self.close();
                });
            }
        });

        contact.ToastLayerView = Backbone.Marionette.ItemView.extend({
            template: function (data) {
                var html = contact.$template.filter('#toast-layer-template').html();
                var compiledTemplate = _.template(html);
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

        contact.GroupSettingsView = Backbone.Marionette.ItemView.extend({
            id: 'group_settings',
            className: 'layer_g layer_type3',
            attributes: {
                style: 'user-select: none;z-index:9999;'
            },
            template: function (data) {
                var html, compiledTemplate = contact.GroupSettingsView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#group-settings-template').html();
                    compiledTemplate = _.template(html);
                    contact.GroupSettingsView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    groupCollection: data.groupCollection,
                    contactModels: data.contactModels

                });
                return html;
            },
            initialize: function (options) {
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
                    if (!self.changed)
                        return;

                    var checkedBoxes = _.map($items.filter(':checked'), function (box) {
                        return parseInt(box.value)
                    });

                    new Backbone.Model({
                        id: 0
                    }).save({
                        contactIDList: _.map(self.contactModels, 'id'),
                        groupIDList: checkedBoxes
                    }, {
                        url: 'contacts/move',
                        success: function () {
                            app.vent.trigger('show:toast-layer', {
                                message: '그룹 설정이 완료되었습니다.'
                            });

                            app.vent.trigger('fetch:group-collection');
                            location.hash = location.hash + '?' + $.param({
                                _: new Date().getTime()
                            })

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
                $(app.rootElement).one('click', function (event) {
                    event.stopPropagation()
                    if ($(event.target).closest('#group_settings').length > 0)
                        return;
                    if ($(event.target).closest('.layer_alert').length > 0)
                        return;
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
                groupSettingsRegion: '#groupSettingsRegion',
                sortLayerRegion: '#sortLayerRegion'
            },
            template: function () {
                var html, compiledTemplate = contact.ContactListSearchView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#contact-list-search-template').html();
                    compiledTemplate = _.template(html);
                    contact.ContactListSearchView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate();
                return html;
            },
            initialize: function (options) {
                this.contactCollection = options.contactCollection;
                this.listenTo(app.vent, 'show:group-settings', this.showGroupSettings);
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
                    self.contactCollection.sort(sortField, sortOrder);
                    app.vent.trigger('show:contact-list');
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
                    self.contactCollection.sort(sortField, 'ASC');
                    app.vent.trigger('show:contact-list');
                });

                var $search = this.$el.find('#tfSearch');
                $search.keyup(_.debounce(function (event) {
                    event.preventDefault && event.stopPropagation();
                    if (!this.value || _.size(this.value.trim()) === 0) {
                        app.vent.trigger('show:contact-list', contact.contactCollection);
                        return;
                    }
                    var models = self.contactCollection.search(this.value);
                    if (_.size(models) === 0) {
                        app.vent.trigger('show:no-search-result');
                        return;
                    }
                    app.vent.trigger('show:contact-list', new contact.ContactCollection(models));
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
                        app.vent.trigger('get:checked-boxes');
                    } catch (e) {
                        app.vent.trigger('show:alert-layer', {
                            messages: ['연락처를 선택해주세요.']
                        });
                    }
                    return false;
                });
            },
            showGroupSettings: function (contactModels) {
                if (contactModels.length === 0)
                    throw new Error('contacts size is zero')

                this.groupSettingsRegion.show(new contact.GroupSettingsView({
                    model: new Backbone.Model({
                        groupCollection: contact.groupCollection,
                        contactModels: contactModels
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
                    contactCollection: data.contactCollection
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
                this.listenTo(app.vent, 'get:checked-boxes', function () {
                    var $checkedBoxes = this.$checkBoxes.filter(':checked');
                    var contactIDList = _.map($checkedBoxes, function (checkedBox) {
                        return parseInt(checkedBox.value);
                    })
                    var models = _.filter(this.contactCollection.models, function (model) {
                        return _.contains(contactIDList, model.id)
                    })
                    app.vent.trigger('show:group-settings', models);
                });

            },
            onRender: function () {
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
            },
            moveToTrash: function () {
                var $checkedBoxes = this.$checkBoxes.filter(':checked');
                app.vent.trigger('show:confirm-layer', {
                    action: 'move-to-trash',
                    messages: [
                        $checkedBoxes.length + '개의 연락처를 삭제하시겠습니까?',
                        '삭제된 연락처는 휴지통으로 이동됩니다.'
                    ],
                    callback: function () {
                        var contactIDList = _.map($checkedBoxes, function (checkedBox) {
                            return parseInt(checkedBox.value);
                        })
                        if (_.size(contactIDList) === 0)
                            return;

                        new Backbone.Model({
                            id: 0
                        }).save({
                            idList: contactIDList
                        }, {
                            url: 'contacts/trash',
                            patch: true,
                            success: function () {
                                var models = _.filter(self.contactCollection.models, function (model) {
                                    return _.contains(contactIDList, model.id)
                                })
                                if (_.size(models) > 0)
                                    app.vent.trigger('show:contact-list', new contact.contactCollection(models));
                            }
                        });
                    }
                });
            }
        });

        contact.NoSearchResultView = Backbone.Marionette.ItemView.extend({
            className: 'addressbook_body',
            template: function () {
                var html, compiledTemplate = contact.NoSearchResultView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#no-search-result-template').html();
                    compiledTemplate = _.template(html);
                    contact.NoSearchResultView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate();
                return html;
            },
        });


        contact.ContactLayerView = Backbone.Marionette.ItemView.extend({
            template: function () {
                var html, compiledTemplate = contact.ContactLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#contact-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.ContactLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({});
                return html;
            },
            onRender: function () {

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
                contactLayerRegion: 'div#contactLayerRegion',
            },
            initialize: function (options) {
                this.contactCollection = options.contactCollection;
                this.listenTo(this.contactCollection, 'sync', this.showContactList);
                this.listenTo(app.vent, 'show:contact-list', this.showContactList);
                this.listenTo(app.vent, 'show:no-search-result', this.showNoSearchResult);
                this.listenTo(app.vent, 'show:contact-layer', this.showContactLayer);
            },
            onRender: function () {
                this.contactListSearchRegion.show(new contact.ContactListSearchView({
                    contactCollection: this.contactCollection
                }));
            },
            showContactList: function (contactCollection) {
                if (contactCollection)
                    this.contactListSearchRegion.currentView.contactCollection = contactCollection;
                else
                    contactCollection = this.contactCollection;

                var contactListView = new contact.ContactListView({
                    model: new Backbone.Model({
                        contactCollection: contactCollection
                    })
                });
                this.contactListRegion.show(contactListView);
                contactListView.$el.appendTo('#' + this.attributes.id);
            },
            showContactLayer: function (contactModel) {
                var model = contactModel ? contactModel : new contact.ContactModel()
                var contactLayerView = new contact.ContactLayerView({
                    model: new Backbone.Model({
                        contactModel: model,
                        isNew: model.isNew()
                    })
                });
                this.contactLayerRegion.show(contactLayerView);
                contactLayerView.$el.appendTo(app.rootElement);
            },
            showNoSearchResult: function () {
                var noSearchResultView = new contact.NoSearchResultView();
                this.contactListRegion.show(noSearchResultView);
                noSearchResultView.$el.appendTo('#' + this.attributes.id);
            }
        });

    });
});