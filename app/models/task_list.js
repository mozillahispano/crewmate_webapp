define(["backbone", "app"], function(Backbone, app) {
  var TaskList = Backbone.Model.extend({
    initialize: function(attributes, options) {
      this.set({projectId: options.projectId});
    },

    urlRoot: function() {
      return app.config.apiServer + '/projects/' + this.get('projectId') + '/task_lists';
    },

    parse: function(response, options) {
      return response;
    }
  });

  return TaskList;
});
