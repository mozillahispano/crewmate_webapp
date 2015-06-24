define([
  "react",
  "backbone",
  "react-backbone"
], function(React, Backbone, ReactBackboneMixin) {
  "use strict";

  var TaskListsView = React.createClass({
    mixins: [ReactBackboneMixin],

    taskListField: function(taskList) {
      var url = "/projects/" + taskList.project_id + '/task_lists/' + taskList.id + '/tasks';
      return React.DOM.li({className: "task_list"},
        React.DOM.a({href: url, key: taskList.id}, taskList.name)
      );
    },

    render: function() {
      return React.DOM.div({}, 
        React.DOM.h4({}, "Task Lists"),
        this.state.collection.map(this.taskListField)
      );
    }
  });

  return TaskListsView;
});
