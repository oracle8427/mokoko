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
                            message: '그룹명을 입력해주세요.'
                        });
                        return false;
                    }

                    if (contact.groupCollection.findGroupModel('name', groupName)) {
                        app.vent.trigger('show:alert-layer', {
                            message: '주소록에 동일한 그룹명이 존재합니다.'
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

                    console.log(self.groupModel);
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

        contact.ContactListView = Backbone.Marionette.ItemView.extend({
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
            onRender: function () {

            }
        });

        contact.ContentLayout = Backbone.Marionette.Layout.extend({
            tagName: 'article',
            attributes: {
                id: 'mArticle'
            },
            template: function (data) {
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
                contactListRegion: 'div#contactListRegion',
            },
            initialize: function (options) {
                this.contactCollection = options.contactCollection;
                this.listenTo(this.contactCollection, 'sync', this.showContactList);
            },
            onRender: function () {

            },
            showContactList: function (contactCollection) {
                this.contactListRegion.show(new contact.ContactListView({
                    model: new Backbone.Model({
                        contactCollection: !contactCollection ? this.contactCollection : contactCollection
                    })
                }));
            }
        });

    });
});