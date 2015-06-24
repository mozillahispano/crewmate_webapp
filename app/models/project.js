define(["backbone", "app"], function(Backbone, app) {
  var Project = Backbone.Model.extend({
    urlRoot: function() {
      return app.config.apiServer + '/projects';
    },

    parse: function(response, options) {
      return response;
    }
  });

  return Project;
});
