define([
  "backbone",
  "models/task_list",
  "app"
], function(Backbone, TaskList, app) {
  "use strict";

  var TaskLists = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.projectId = options.projectId;
    },

    model: TaskList,

    url: function() {
      return app.config.apiServer + '/projects/' + this.projectId + '/task_lists';
    },
    // https://gist.github.com/geddski/1610397

    parse: function(response) {
      return response.objects;
    }
  });

  return TaskLists;
});
