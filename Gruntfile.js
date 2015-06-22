var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({

    clean: {
      dist: ['dist/']
    },

    jshint: {
      all: ['Gruntfile.js', 'app/**/*.js']
    },

    copy: {
      main: {
        files:[{
          src: ['index.html', 'images/*', 'app/**/*.js', 'components/**/*.js',
                'styles/*'],
          dest: 'dist/'
        }]
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          middleware: function (connect) {
            return [
              mountFolder(connect, 'dist')
            ];
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', [ 'jshint', 'clean', 'copy',
                                  'connect:server:keepalive']);
};
