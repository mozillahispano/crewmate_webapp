define([
  "backbone",
  "underscore",
  "react",
  "app",
  "views/login_view",
  "collections/projects",
  "views/projects_view",
  "collections/task_lists",
  "views/task_lists_view",
  "collections/tasks",
  "views/tasks_view"
], function(
  Backbone,
  _,
  React,
  app,
  LoginView,
  Projects,
  ProjectsView,
  TaskLists,
  TaskListsView,
  Tasks,
  TasksView
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
      "": "projects",
      "login": "login",
      "projects/:project_id/task_lists": "taskLists",
      "projects/:project_id/task_lists/:task_list_id/tasks": "tasks"
    },

    projects: function() {
      var _this = this;
      var el = document.getElementById('main');
      this.projects = new Projects();
      this.xhr = this.projects.fetch({
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", app.auth.get("authHash"));
        },
        success: function() {
          React.render(React.createElement(ProjectsView, {
            collection: _this.projects
          }), el);
        }
      });
    },

    taskLists: function(projectId) {
      var el = document.getElementById('main');
      var _this = this;
      this.taskLists = new TaskLists([], {projectId: projectId});
      this.taskLists.fetch({
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", app.auth.get("authHash"));
        },
        success: function() {
          React.render(React.createElement(TaskListsView, {
            collection: _this.taskLists
          }), el);
        }
      });
    },

    tasks: function(projectId, taskListId) {
      var el = document.getElementById('main');
      var _this = this;
      this.tasks = new Tasks([], {projectId: projectId,
                                  taskListId: taskListId});
      this.tasks.fetch({
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", app.auth.get("authHash"));
        },
        success: function() {
          React.render(React.createElement(TasksView, {
            collection: _this.tasks
          }), el);
        }
      });
    },

    login: function() {
      var el = document.getElementById('main');
      if (this.xhr !== undefined) {
        this.xhr.abort();
      }
      React.render(React.createElement(LoginView, null), el);
    }
  });

  return Router;
});
