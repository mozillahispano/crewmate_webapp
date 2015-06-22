define([
  "backbone",
  "underscore",
  "react",
  "views/login_view",
  "views/task_lists_view"
], function(
  Backbone,
  _,
  React,
  LoginView,
  TaskListsView
) {
  "use strict";

  var Router = Backbone.Router.extend({

    initialize: function() {
      $(document).on('click', 'a[href]:not([data-bypass])',
                     _.bind(this.clickInterceptor, this));
    },

    close: function () {
      $(document).off('click', 'a[href]:not([data-bypass])');
    },

    clickInterceptor: function (evt) {
      if (evt.defaultPrevented) {
        return;
      }

      // Get the absolute anchor href.
      var href = { prop: $(evt.currentTarget).prop('href'),
                   attr: $(evt.currentTarget).attr('href') };

      // Get the absolute root.
      var appRoot = '/';
      var root = location.protocol + '//' + location.host + appRoot;

      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      if (href.prop.slice(0, root.length) === root) {
        // if it's relative
        // Remove initial '#' or '/' if present
        var whereToGo = href.attr.replace(/^[#\/]/, '');
        this.navigate(whereToGo, { trigger: true });
      } else {
        // if it's not relative
        // In our particular case, we don't want to enable ANY link outside
        // that does not have a data-bypass attribute. So do nothing here.
        console.log('Attempt to load url ' + href.prop);
      }
    },

    routes: {
      "": "taskLists",
      "login": "login"
    },

    taskLists: function() {
      var el = document.getElementById('main');
      React.render(React.createElement(TaskListsView, null), el);
    },

    login: function() {
      var el = document.getElementById('main');
      React.render(React.createElement(LoginView, null), el);
    }
  });

  return Router;
});
