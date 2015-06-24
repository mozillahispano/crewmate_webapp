define([
  "backbone",
  "models/project",
  "app"
], function(Backbone, Project, app) {
  "use strict";

  var Projects = Backbone.Collection.extend({
    model: Project,

    url: function() {
      return app.config.apiServer + '/projects';
    },

    parse: function(response) {
      return response.objects;
    }
  });

  return Projects;
});
