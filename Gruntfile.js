module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: ['<%= pkg.src %>/scss/**/*.{scss,sass}'],
                tasks: ['buildCSS']
            },
            images: {
                files: ['<%= pkg.src %>/{img,rimg}/**/*.{png,jpg,jpeg,gif}'],
                tasks: ['buildImages']
            },
            icons: {
                files: ['<%= pkg.src %>/icons/*.svg'],
                tasks: ['buildIcons']
            },
            js : {
                files: ['<%= pkg.src %>/js/*.js'],
                tasks: ['buildJs']
            }
        },
        sass: {
            style: {
                options: {                       // Target options
                    style: 'expanded',
                    sourceMap: true,
                    cacheLocation: '<%= pkg.source %>/scss/cache'
                },
                files: {
                    '<%= pkg.dist %>/css/style.css': '<%= pkg.src %>/scss/style.scss'
                }
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: '<%= pkg.dist %>/css/',
                src: ['*.css', '!*.min.css', '!*-unprefixed.css'],
                dest: '<%= pkg.dist %>/css/',
                ext: '.min.css'
            },
            options: {
                report: 'min'
            }
        },
        clean: {
            css: ['<%= pkg.dist %>/css'],
            img: ['<%= pkg.dist %>/img'],
            options: {
                force: true
            }
        },
        copy: {
            img: {
                expand: true,
                cwd: '<%= pkg.src %>/img/',
                src: '**',
                dest: '<%= pkg.dist %>/img/'
            },
            js: {
                expand: true,
                cwd: '<%= pkg.src %>/js/',
                src: '**',
                dest: '<%= pkg.dist %>/js/'
            }
        },
        responsive_images: {
            build: {
                options: {
                    engine: 'im',
                    sizes: [{
                        name: 'small',
                        width: '50%',
                        height: '50%',
                        rename: false,
                    }, {
                        name: 'large',
                        width: '100%',
                        height: '100%',
                        rename: false,
                        suffix: '@2x'
                    }]
                },
                files: [{
                    expand: true,
                    src: ['rimg/**/*.{jpg,jpeg,gif,png}'],
                    cwd: '<%= pkg.src %>/',
                    dest: '<%= pkg.dist %>/'
                }]
            }
        },
        imagemin: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= pkg.dist %>',
                    src: ['**/*.{png,jpg,jpeg,gif}'],
                    dest: '<%= pkg.dist %>'
                }],
                options: {
                    pngquant: true,
                    progressive: true,
                    interlaced: true
                }
            }
        },
        webfont: {
            icons: {
                src: '<%= pkg.src %>/icons/*.svg',
                dest: '<%= pkg.dist %>/fonts',
                destCss: '<%= pkg.src %>/scss',
                options: {
                    stylesheet: 'scss',
                    normalize: true,
                    codepoints: {
                        'download': 0xE001,
                        'angle-small-right': 0xE002,
                        'angle-small-up': 0xE003,
                        'angle-small-down': 0xE004,
                        'quote': 0xE005
                    },
                    templateOptions: {
                        classPrefix: 'icon-',
                        htmlDemo: false
                    }
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['> 5%', 'last 2 versions', 'ie 9']
            },
            dist: {
                files: {
                    '<%= pkg.dist %>/css/style.css': '<%= pkg.dist %>/css/style.css'
                }
            }
        }
    });


    grunt.registerTask('default', 'watching for changes on configured files', function() {
        grunt.loadNpmTasks('grunt-contrib-watch');

        grunt.task.run('watch');
    });

    grunt.registerTask('buildCSS', 'processes scss-Files to CSS', function() {
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-autoprefixer');
        grunt.loadNpmTasks('grunt-contrib-cssmin');

        grunt.task.run(
            'clean:css',
            'sass:style',
            'autoprefixer',
            'cssmin:minify'
        );
    });

    grunt.registerTask('buildImages', 'compresses images', function() {
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-responsive-images');
        grunt.loadNpmTasks('grunt-contrib-imagemin');

        grunt.task.run(
            'clean:img',
            'copy:img',
            'responsive_images:build',
            'imagemin:images'
        );
    });

    grunt.registerTask('buildIcons', 'build icon webfont from svg files', function() {
        grunt.loadNpmTasks('grunt-webfont');

        grunt.task.run(
            'webfont:icons'
        );
    });

    grunt.registerTask('buildJs', 'build js files, uglify later, copy for now ', function() {
        grunt.loadNpmTasks('grunt-contrib-copy');

        grunt.task.run(
            'copy:js'
        );
    });


    grunt.registerTask('build', ['buildCSS', 'buildImages', 'buildIcons']);

};
