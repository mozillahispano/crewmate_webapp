require.config({
  paths: {
    "underscore": "../components/lodash/dist/lodash.underscore",
    "jquery": "../components/jquery/dist/jquery",
    "backbone": "../components/backbone/backbone",
    "react": "../components/react/react",
    "react-backbone": "../components/backbone-react-component/lib/component"
  },

  shim: {
    "jquery": {
      exports: "$"
    },

    "underscore": {
      exports: "_"
    }
  }
});

require([
  "underscore",
  "app",
  "config",
  "router",
  "models/auth"
], function(_, app, config, Router, Auth) {
  app.config = config;
  app.router = new Router();
  app.auth = new Auth();

  Backbone.history.on("route", function(router, route, params) {
    var lastPath = Backbone.history.getFragment();

    if (lastPath !== 'login') {
      app.lastPath = lastPath;
    }

    if (!app.auth.get('isAuthenticated')) {
      Backbone.history.navigate("/login", true);
    }
  });

  Backbone.history.start({ pushState: true, root: app.root });
});
