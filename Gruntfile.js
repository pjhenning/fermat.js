// ================================================================================================
// Gruntfile for Mathigon's JS Libraries
// (c) 2014 Mathigon
// ================================================================================================


/* jshint node: true */

module.exports = function(grunt) {

    // Load npm tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-markdown');

    var index = grunt.file.readJSON('src/index.json');
    var jsFiles = index.map(function(x) { return 'src/'+x+'.js'; });
    var docFiles = index.map(function(x) { return 'docs/'+x+'.md'; });

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        project: {
            src: 'src',
            banner: '// <%= pkg.title %>\n// (c) 2014, Mathigon / Philipp Legner\n' +
                    '// MIT License (<%= pkg.license.url %>)\n\n'
        },

        clean: {
            dist: ['dist'],
            docs: ['dist/docs']
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: '.jshintrc'
            },
            before: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            after: {
                options: { undef: true, unused: true },
                files: { src: ['dist/<%= pkg.name %>.js'] }
            }
        },

        concat: {
            dev: {
                options: {
                    banner: '<%= project.banner %> (function() {\n',
                    footer: '\n\n})();',
                    separator: '\n',
                    stripBanners: { line: true }
                },
                src: jsFiles,
                dest: 'dist/<%= pkg.name %>.js',
            },
            docs: {
                options: {
                    banner: '# <%= pkg.title %>\n\n',
                    separator: '\n',
                },
                src: docFiles,
                dest: 'dist/docs.html'
            }
        },

        nodeunit: {
            options: {
                reporter: 'default',
                reporterOptions: { }
            },
            all: ['test/**/*.js']
        },

        uglify: {
            options: {
                banner: '<%= project.banner %>',
                mangle: { except: ['M'] }
            },
            prod: {
                files: [{
                    src: 'dist/<%= pkg.name %>.js',
                    dest: 'dist/<%= pkg.name %>.min.js'
                }]
            }
        },

        markdown: {
            options: {
                preCompile: function(src) {
                    return src.split('\n').map(function(line) {
                        var m = (/^###\s+(.*)/g).exec(line);
                        return m ? ['### <a name="', '"></a>[M.', '](#', ')'].join(m[1]) : line;
                    }).join('\n');
                },
                template: 'docs/template.jst'
            },
            docs: {
                files: { 'dist/docs.html': 'dist/docs.html' }
            }
        }

    });

    grunt.registerTask('default', ['jshint:before', 'concat:dev', 'jshint:after', 'nodeunit:all',
        'uglify:prod', 'concat:docs', 'markdown:docs']);
};
