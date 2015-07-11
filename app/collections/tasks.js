define([
  "backbone",
  "models/task",
  "app"
], function(Backbone, Task, app) {
  var Tasks = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.projectId = options.projectId;
      this.taskListId = options.taskListId;
    },

    url: function() {
      var projectPath = '/projects/' + this.projectId;
      var taskListPath = '/task_lists/' + this.taskListId;
      return app.config.apiServer + projectPath + taskListPath + '/tasks';
    },

    parse: function(response) {
      return response.objects;
    }
  });

  return Tasks;
});
