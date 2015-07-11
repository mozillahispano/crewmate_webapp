define(["react"], function(React) {
  var TaskCardView = React.createClass({
    click: function(e) {
      // TODO: transition to task details
      console.log('click fired');
    },

    render: function() {
      var classes = "task " + this.props.cardType;
      return React.DOM.div({className: "task-box-content",
                            draggable: "true",
                            onDragStart: this.props.onDragStart,
                            onDragEnd: this.props.onDragEnd,
                            onClick: this.click},
        React.DOM.section({className: classes}, 
          React.DOM.li({}, this.props.card.get('name'))
        )
      );
    }
  });

  return TaskCardView;
});
