define(["backbone", "app"], function(Backbone, app) {
  var Task = Backbone.Model.extend({
    urlRoot: function() {
      var projectPath = '/projects/' + this.get('project_id');
      var taskListPath = '/task_lists/' + this.get('task_list_id');
      return app.config.apiServer + projectPath + taskListPath + '/tasks';
    }
  });

  return Task;
});
