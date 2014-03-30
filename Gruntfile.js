/*! =========================================================================
 * Grunt Tasks for AngularJS web apps v0.1.0
 * Copyright 2014 (c) Pongstr Ordillo. MIT License.
 * ========================================================================= */

module.exports = function(grunt) {

  // Project Configuration

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! ========================================================================\n' +
            ' * <%= pkg.name %> v<%= pkg.version %> \n' +
            ' * =========================================================================\n' +
            ' * <%= pkg.description %> \n'+
            ' * Authored by <%= pkg.author %> [<%= pkg.email %>] \n' +
            ' * ========================================================================= */',

    // Copy assets that don't need processing
    copy: {
      fonts: {
        files: [
          { // Bootstrap Glyphicons
            expand: true,
            flatten: true,
            src: ['bower_components/bootstrap/dist/fonts/*'],
            dest: 'application/assets/fonts/bootstrap/',
            filter: 'isFile'
          },
          { // Font-Awesome Glyphs
            expand: true,
            flatten: true,
            src: ['bower_components/font-awesome/fonts/*'],
            dest: 'application/assets/fonts/font-awesome/',
            filter: 'isFile'
          }
        ]
      },

      javascript: {
        files: [
          { // Copy AngularJS library
            expand: true,
            flatten: true,
            src: [
              'bower_components/angular/angular.js',
              'bower_components/angular/angular.min.js',
              'bower_components/angular-animate/angular-animate.js',
              'bower_components/angular-animate/angular-animate.min.js',
              'bower_components/angular-cookies/angular-cookies.js',
              'bower_components/angular-cookies/angular-cookies.min.js',
              'bower_components/angular-loader/angular-loader.js',
              'bower_components/angular-loader/angular-loader.min.js',
              'bower_components/angular-resource/angular-resource.js',
              'bower_components/angular-resource/angular-resource.min.js',
              'bower_components/angular-route/angular-route.js',
              'bower_components/angular-route/angular-route.min.js',
              'bower_components/angular-sanitize/angular-sanitize.js',
              'bower_components/angular-sanitize/angular-sanitize.min.js',
              'bower_components/angular-scenario/angular-scenario.js',
              'bower_components/angular-scenario/angular-scenario.min.js',
              'bower_components/angular-touch/angular-touch.js',
              'bower_components/angular-touch/angular-touch.min.js'
            ],
            dest: 'application/core/lib/angular/',
            filter: 'isFile'
          },
          { // Copy jQuery library
            expand: true,
            flatten: true,
            src: [
              'bower_components/jquery/jquery.js',
              'bower_components/jquery/jquery.min.js',
              'bower_components/jquery/jquery.min.map'
            ],
            dest: 'application/core/lib/jquery/',
            filter: 'isFile'
          },
          { // Copy Bootstrap
            expand: true,
            flatten: true,
            src: ['bower_components/bootstrap/dist/js/*'],
            dest: 'application/core/lib/bootstrap/',
            filter: 'isFile'
          }
        ]
      },

      lessfiles: {
        files: [
          { // Copy Bootstrap Less files
            expand: true,
            flatten: true,
            src: ['bower_components/bootstrap/less/*'],
            dest: 'source/less/bootstrap/',
            filter: 'isFile'
          },
          { // Font-awesome less stylesheets
            expand: true,
            flatten: true,
            src: ['bower_components/font-awesome/less/*'],
            dest: 'source/less/font-awesome',
            filter: 'isFile'
          }
        ]
      }
    },

    // Compile Less stylesheets
    less: {
      development: {
        options: {
          strictMath: true,
          sourceMap: false
        },
        files: {
          'application/assets/css/<%= pkg.name %>.css' : 'source/less/bootstrap.less',
          'application/assets/css/font-awesome.css': 'source/less/font-awesome/font-awesome.less'
        }
      },
      production: {
        options: {
          strictMath: true,
          sourceMap: false,
          compress: true
        },
        files: {
          'application/assets/css/<%= pkg.name %>.min.css' : 'source/less/bootstrap.less',
          'application/assets/css/font-awesome.min.css': 'source/less/font-awesome/font-awesome.less'
        }
      }
    },

    // Watch Tasks
    watch: {
      less: {
        files: ['source/less/**/*.less'],
        tasks: ['less:development']
      },
      jshint: {
        files: [
          'application/assets/js/app/*.js',
          'server/server.js'
        ],
        tasks: ['jshint:express', 'jshint:app']
      }
    },

    // Optimise Image Assets
    imagemin: {
      dynamic: {
        options: {
          pngquant: true,
          optimizationLevel: 3
        },
        files:[
          {
            expand: true,
            src: ['*.{png,jpg,gif}'],
            cwd: 'source/img/',
            dest: 'application/assets/img/'
          }
        ]
      }
    },

    // Add Banners for Application Build info
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %> \n',
          linebreak: true
        },
        files: {
          src: [
            'application/assets/css/<%= pkg.name %>.css',
            'application/assets/css/<%= pkg.name %>.min.css',
            'application/core/app/app.js'
          ]
        }
      }
    },

    // Lint gruntfile and js apps
    jshint: {
      grunt: {
        src: ['Gruntfile.js']
      },
      express: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [
          'server/server.js'
        ]
      },
      app: {
        options: {
          jshintrc: 'application/core/app/.jshintrc'
        },
        src: [
          'application/core/app/app.js'
        ]
      }
    },

    bump: {
      options: {
        file: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        createTag: false,
        tagName: '%VERSION%-angularjs',
        tagMessage: 'version v%VERSION%',
        push: false,
        pushTo: 'origin'
      }
    }
  });

  // These grunt plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');


  // Update Frontend Packages
  grunt.registerTask('updatepkg', ['copy']);

  // Less CSS Tasks
  grunt.registerTask('watchless', ['watch:less']);
  grunt.registerTask('buildless', ['less']);

  // Javascript Tasks
  grunt.registerTask('lintjs', ['jshint']);
  grunt.registerTask('watchjs', ['watch:jshint']);

  // Optimise and Build images for production
  grunt.registerTask('buildimg', ['imagemin']);

  // Release/Bump a version
  grunt.registerTask('release-version', ['less', 'imagemin', 'bump', 'usebanner']);

  // Default Task
  grunt.registerTask('default', ['less', 'imagemin']);

};