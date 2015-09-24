'use strick'
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  require('time-grunt')(grunt);

  var config = {
  	app: 'app',
  	dist: 'dist'
  };

  grunt.initConfig({
    config: config,
    /*copy: {
        dist: {
            files:[
                {
                    src: '<%= config.app %>/index.html',
                    dest: '<%= config.dist %>/index.html'
                },
                {
                    src: '<%= config.app %>/js/index.js',
                    dest: '<%= config.dist %>/js/index.js'
                }
            ]
        }
    },
    clean: {
        dist: {
            src:['<%= config.dist %>/index.html','<%= config.app %>/js/index.js']
        }
    }*/
      copy: {
          dist: {
              files:{
                  '<%= config.dist %>/index.html':'<%= config.app %>/index.html',
                  '<%= config.dist %>/js/index.js':'<%= config.app %>/js/index.js'
              }
          }
      },
      clean: {
          dist: {
              src: ['<%= config.dist %>/**/*']
          }
      }
  });

};