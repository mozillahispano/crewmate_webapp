define([
  "react",
  "backbone",
  "app"
], function(React, Backbone, app) {
  "use strict";

  var LoginView = React.createClass({
    loginForm: function() {
      return React.DOM.form({className: "login"},
        React.DOM.input({placeholder: "Username", className: "username"}),
        React.DOM.input({type: "password", placeholder: "Password", className: "password"}),
        React.DOM.button({onClick: this.handleLogin}, "login")
      );
    },

    encodeCred: function(obj) {
      var hash = btoa(obj.username + ":" + obj.password);
      return "Basic " + hash;
    },

    handleLogin: function(e) {
      e.preventDefault();
      var obj = {};
      $('input').map(function() {
        obj[this.className] = this.value;
      });
      var hash = this.encodeCred(obj);
      app.auth.authenticate(hash);
    },

    loginHeader: function() {
      return React.DOM.div({className: "login-header"});
    },

    render: function() {
      return React.DOM.div({className: "login-wrap"},
        this.loginHeader(),
        this.loginForm()
      );
    }
  });

  return LoginView;
});
