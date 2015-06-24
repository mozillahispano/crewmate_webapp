define([
  "react",
  "backbone",
  "react-backbone"
], function(
  React,
  Backbone,
  ReactBackboneMixin
) {
  "use strict";

  var ProjectsView = React.createClass({
    mixins: [ReactBackboneMixin],

    projectField: function(project) {
      var url = "/projects/" + project.id + '/task_lists';
      return React.DOM.li({className: "project"},
        React.DOM.a({href: url, key: project.id}, project.name)
      );
    },

    render: function() {
      return React.DOM.div({},
        React.DOM.h4({}, "Projects"),
        this.state.collection.map(this.projectField)
      );
    }
  });

  return ProjectsView;
});
