define(["backbone", "app"], function(Backbone, app) {
  "use strict";

  var Auth = Backbone.Model.extend({
    defaults: {
      userId: null,
      username: null,
      avatarUrl: null,
      authHash: null
    },

    initialize: function() {
      this.checkAuth();
    },

    isAuthenticated: false,

    setAuth: function(user, hash) {
      this.set({
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatar_url,
        isAuthenticated: true,
        authHash: hash
      });
      Backbone.history.navigate(app.lastPath, true);
    },

    checkAuth: function() {
      var _this = this;
      var userHash = sessionStorage.getItem('userHash');

      if (!this.get('isAuthenticated') && (userHash !== null)) {
        _this.authenticate(userHash);
      }
    },

    authenticate: function(hash) {
      var _this = this;
      var url = app.config.apiServer + '/account';

      $.ajax({
        type: 'get',
        url: url,
        headers: {
        'Authorization': hash
        }
      }).done(function(data) {
        _this.setAuth(data, hash);
        if (sessionStorage.getItem('userHash') === null) {
          sessionStorage.setItem('userHash', hash);
        }
      });
    }
  });

  return Auth;
});
