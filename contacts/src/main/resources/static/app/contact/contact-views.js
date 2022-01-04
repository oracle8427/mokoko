define(['app', 'text!app/contact/contact-template.html', 'app/contact/contact-models'], function (app, template) {
    app.module('contact', function (contact, app, Backbone, Marionette, $, _) {
        contact.$template = $(template);

        contact.SidebarView = Backbone.Marionette.Layout.extend({
            initialize: function () {
                this.listenTo(contact.groupCollection, 'sync', this.showGroups);
                this.listenTo(app.vent, 'fetch:contact-count', this.getContactCount);
                this.listenTo(app.vent, 'show:group-layer', this.showGroupLayer);
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
                groupLayerRegion: 'div#groupLayerRegion'
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
                var groupLayerView = new contact.GroupLayerView({
                    model: groupModel ? groupModel : new contact.GroupModel()
                });
                this.groupLayerRegion.show(groupLayerView);
                groupLayerView.$el.appendTo(app.rootElement);
                app.vent.trigger('show:dimmed');
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
                this.$el.data('id', this.model.id);
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
                if (this.model.isNew())
                    this.model.set('isNew', true);
            },
            template: function (data) {
                var html, compiledTemplate = contact.GroupLayerView.compiledTemplate;
                if (!compiledTemplate) {
                    html = contact.$template.filter('#group-layer-template').html();
                    compiledTemplate = _.template(html);
                    contact.GroupLayerView.compiledTemplate = compiledTemplate;
                }
                html = compiledTemplate({
                    group: data
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
                    $groupName.focus();
                }, 1)

                var $closeButton = this.$el.find('button.btn_close').add(this.$el.find('button.btn_type1'));
                $closeButton.click(function (event) {
                    event.preventDefault() && event.stopPropagation();
                    app.vent.trigger('hide:dimmed');
                    self.close();
                });
            }
        });

        contact.ContentLayout = Backbone.Marionette.Layout.extend({
            template: function (data) {
                var html = contact.$template.filter('#content-layout-template').html();
                var compiledTemplate = _.template(html);
                html = compiledTemplate({
                    group: data,
                });
                return html;
            },
            regions: {},
            initialize: function (options) {

            },
            onRender: function () {

            }
        });

    });
});