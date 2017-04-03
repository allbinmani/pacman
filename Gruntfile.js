"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            jshint: {
                files: ['Gruntfile.js', 'src/js/**/*.js', 'test/**/*.js'],
                options: {
                    "esversion": 6,
                    "strict": true,
                    "globalstrict": true,
                    "eqeqeq": true,
                    "eqnull": true,
                    "curly": true,
                    "asi": false,
                    "evil": false,
                    "browser": true,
                    "node": true
                }
            },
            less: {
                build: {
                    options: {
                        compress: true,
                        ieCompat: false,
                        banner: '/*! <%= pkg.name %> <%= pkg.version %> dev <%= grunt.template.today("dd-mm-yyyy") %> */  \n\n'
                    },
                    files: {
                        'build/css/app.css': 'src/less/main.less'
                    }
                },
                dist: {
                    options: {
                        compress: true,
                        ieCompat: false,
                        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */  \n\n'
                    },
                    files: {
                        'dist/css/app.css': 'src/less/main.less'
                    }
                }
            },

            uglify: {
                options: {
                    // the banner is inserted at the top of the output
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                    compress: true,
                    mangle: false,
                    report: 'min',
                    sourceMap: false
                },
                build: {
                    options: {
                        compress: true,
                        mangle: true,
                        sourceMap: true

                    },
                    files: {
                        'build/js/app.js': 'build/js/bundle.js'
                    }
                },
                dist: {
                    files: {
                        'dist/js/app.js': 'dist/js/bundle.js'
                    }
                }
            },

            browserify: {
                options: {
                    transform: [["babelify", {global: true,
                                              only: ['src/**/*.js', 'src/*.js'],
                                              compact: false,
                                              presets: 'es2015'}],
                                ["envify", {global: true}],
                               ],
                    debug: true
                },
                dist: {
                    options: {
                        debug: false,
                        browserifyOptions: {
                            debug: false
                        }
                    },
                    files: {
                        'dist/js/bundle.js': 'src/js/index.js'
                    }
                },
                build: {
                    options: {
                        debug: true,
                        browserifyOptions: {
                            debug: true
                        }
                    },
                    files: {
                        'build/js/bundle.js': 'src/js/index.js'
                    }
                }
            },
            htmlmin: {
                options: { // Global options
                    removeComments: true,
                    collapseWhitespace: true
                },
                dist: {
                    options: { // Overrides
                        removeComments: true,
                        collapseWhitespace: true
                    },
                    files: {
                        'dist/index.html': 'src/index.html',
                        'dist/404.html': 'src/404.html'
                    }
                },
                build: {
                    files: {
                        'build/index.html': 'src/index.html',
                        'build/404.html': 'src/404.html'
                    }
                }
            },

            watch: {
                src_js: {
                    files: ['<%= jshint.files %>'],
                    tasks: ['build']
                },
                src_html: {
                    files: ['src/**/*.html', 'src/**/*/*.html'],
                    tasks: ['build']
                },
                html: {
                    files: ['src/index.html'],
                    tasks: ['htmlmin:build']
                },
                less: {
                    files: ['src/less/*.less'],
                    tasks: ['less:build']
                }
            },
            browserSync: {
                build: {
                    bsFiles: {
                        src : ['build/css/*.css',
                               'build/js/*.js',
                               'build/404.html',
                               'build/index.html']
                    },
                    options: {
                        online: true,
                        watchTask: true,
                        server: {
                            baseDir: "./build/"
                        }
                    }
                },
                dist: {
                    bsFiles: {
                        src : 'dist/**/*'
                    },
                    options: {
                        online: true,
                        server: {
                            baseDir: "./dist/"
                        }
                    }
                }
            },

            copy: {
                build: {
                    files: [
                        {expand: true, cwd: './src',src: ['index.html'], dest: 'build/', filter: 'isFile'},
                        {expand: true, cwd: './',src: ['assets/*.mod'], dest: 'build/', filter: 'isFile'}
                    ]
                },
                dist: {
                    files: [
                        {expand: true, cwd: './src',src: ['index.html'], dest: 'dist/', filter: 'isFile'},
                        {expand: true, cwd: './',src: ['assets/*.mod'], dest: 'dist/', filter: 'isFile'}
                    ]
                }
            }
        });
    
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('dev', ['build', 'browserSync:build', 'watch']);
    grunt.registerTask('build', ['jshint',
                                 'browserify:build',
                                 //                                 'uglify:build',
                                 'htmlmin:build',
                                 'less:build',
                                 'copy:build']);
    grunt.registerTask('dist', ['jshint',
                                'browserify:dist',
                                'htmlmin:dist',
                                'less:dist',
                                'copy:dist',
                                'uglify:dist']);
    grunt.registerTask('default', ['build']);
};