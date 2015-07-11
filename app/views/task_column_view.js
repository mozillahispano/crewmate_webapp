define([
  "react",
  "views/task_card_view",
  "models/task",
  "app"
], function(React, TaskCardView, Task, app) {
  var TaskColumnView = React.createClass({
    taskCard: function(task, i) {
      return React.createElement(TaskCardView, {
        card: task, cardType: this.props.title, key: task.get('id'),
        onDragStart: this.props.dragStart.bind(null, i),
        onDragEnd: this.props.dragEnd
        }, task.get('name')
      );
    },

    render: function() {
      return React.DOM.section({className: "task-box",
                                onDragEnter: this.props.dragEnter,
                                onDragOver: this.props.dragOver,
                                onDragLeave: this.props.dragLeave,
                                onDrop: this.props.drop},
        React.DOM.h4({}, this.props.title),
        this.props.cards.map(this.taskCard)
      );
    }
  });

  return TaskColumnView;
});
