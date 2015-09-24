'use strick';
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    var config = {
        src: 'src',
        dist: 'dist'
    };

    grunt.initConfig({

        config: config,

        uglify: {
          dist: {
              files: {
                  '<%= config.dist %>/test.min.js': ['<%= config.src %>/test.js']
              }
          }
        },

        jshint: {
            all: ['Gruntfile.js', '<%= config.dist %>/**/*.js', '<%= config.src %>/**/*.js']
        },

        watch: {
            dist: {
                files: ['<%= config.src %>/**/*.js'],
                tasks: ['jshint','uglify'],
                options: {
                    spawn: false
                }
            }
        }

    });

    grunt.registerTask('default', ['watch','jshint','uglify']);

};