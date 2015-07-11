define([
  "react",
  "backbone",
  "react-backbone",
  "views/task_column_view",
  "views/task_card_view",
  "underscore",
  "models/task",
  "app"
], function(
  React,
  Backbone,
  ReactBackboneMixin,
  TaskColumnView,
  TaskCardView,
  _,
  Task,
  app) {
  var TasksView = React.createClass({
    mixins: [ReactBackboneMixin],

    getInitialState: function() {
      var _this = this;
      this.socketClient = new WebSocket(app.config.webSocketServer);
      this.socketClient.onmessage = function(e) {
        var obj = JSON.parse(e.data);
        _this.updateUI(obj.lastStatus, obj.newStatus, obj.taskId);
      };
      var tasks = {};
      this.setTaskColumns(tasks, "backlog", 0);
      this.setTaskColumns(tasks, "todo", 1);
      this.setTaskColumns(tasks, "doing", 2);
      this.setTaskColumns(tasks, "done", 3);
      return {
        tasks: tasks
      };
    },

    setTaskColumns: function(obj, name, status) {
      var tasks = this.props.collection.where({status: status});
      obj[name] = tasks;
      return obj;
    },

    updateUI: function(lastStatus, newStatus, taskId) {
      var oldTaskColumn = this.state.tasks[lastStatus];
      var newTaskColumn = this.state.tasks[newStatus];
      var task = _.where(oldTaskColumn, {id: taskId})[0];
      var statusToUpdate = this.getStatus(newStatus);
      task.set({status: statusToUpdate});

      var newOldTaskColumn = _.filter(oldTaskColumn, function(taskInColumn) {
        return taskInColumn.get('id') !== taskId;
      });

      newTaskColumn.push(task);

      var tasks = this.state.tasks;
      tasks[lastStatus] = newOldTaskColumn;
      tasks[newStatus] = newTaskColumn;

      this.setState({tasks: tasks});
    },

    // droppable element
    dragEnter: function(e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.target.classList.contains('task-box')) {
        e.target.classList.add('over');
      }
    },

    dragOver: function(e) {
      e.stopPropagation();
      e.preventDefault();
    },

    dragLeave: function(e) {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.remove('over');
    },

    drop: function(e) {
      e.stopPropagation();
      e.preventDefault();
      e.target.classList.remove('over');
      if (e.target.classList.contains('task-box')) {
        var task = JSON.parse(e.dataTransfer.getData('taskInfo'));
        var oldStatus = this.getStatusName(task.status);
        var newStatus = e.target.children[0].textContent;
        var oldTaskColumn = this.state.tasks[oldStatus];
        var newTaskColumn = this.state.tasks[newStatus];

        var newOldTaskColumn = _.filter(oldTaskColumn, function(taskInColumn) {
          return taskInColumn.get('id') !== task.id;
        });

        var taskModel = new Task(task);
        var statusToUpdate = this.getStatus(newStatus);
        taskModel.set({status: statusToUpdate});
        taskModel.save();

        newTaskColumn.push(taskModel);

        var tasks = this.state.tasks;
        tasks[oldStatus] = newOldTaskColumn;
        tasks[newStatus] = newTaskColumn;

        this.setState({
          tasks: tasks
        });

        var obj = {
          taskId: task.id,
          newStatus: newStatus,
          lastStatus: oldStatus
        };
        this.socketClient.send(JSON.stringify(obj));
      }
    },

    // draggable element
    dragStart: function(i, e) {
      e.target.style.opacity = '0.7';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect = 'move';
      var classList = e.target.children[0].classList;
      var taskStatus = classList[classList.length - 1];
      var task = this.state.tasks[taskStatus][i];
      var str = JSON.stringify(task.attributes);
      e.dataTransfer.setData('taskInfo', str);
    },

    dragEnd: function(e) {
      // this event is not fired on Firefox if dataTransfer is not setted
      e.target.style.opacity = '1';
      console.log('dragEnd');
    },

    taskColumn: function(name) {
      return React.createElement(TaskColumnView, {
        cards: this.state.tasks[name],
        title: name,
        dragEnter: this.dragEnter,
        dragOver: this.dragOver,
        dragLeave: this.dragLeave,
        drop: this.drop,
        dragStart: this.dragStart,
        dragEnd: this.dragEnd
      });
    },

    render: function() {
      return React.DOM.div({}, 
        React.DOM.header({}, React.DOM.h4({}, "Tasks")),
        React.DOM.section({},
          React.DOM.div({className: "board"},
            this.taskColumn("backlog", 0),
            this.taskColumn("todo", 1),
            this.taskColumn("doing", 2),
            this.taskColumn("done", 3)
        ))
      );
    },

    getStatus: function(statusName) {
      var status;
      switch (statusName) {
        case "backlog":
          status = 0;
          break;
        case "todo":
          status = 1;
          break;
        case "doing":
          status = 2;
          break;
        case "done":
          status = 3;
          break;
      }
      return status;
    },

    getStatusName: function(status) {
      var name;
      switch (status) {
        case 0:
          name = "backlog";
          break;
        case 1:
          name = "todo";
          break;
        case 2:
          name = "doing";
          break;
        case 3:
          name = "done";
          break;
      }

      return name;
    }
  });

  return TasksView;
});
