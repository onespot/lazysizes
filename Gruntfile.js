/*global module:true*/
(function () {
	"use strict";

	var pkg;

	module.exports = function (grunt) {

		// Project configuration.
		grunt.initConfig({
			// Metadata.
			pkg: pkg = grunt.file.readJSON("package.json"),
			banner: "/*! <%= pkg.name %> - v<%= pkg.version %> */\n",
			// Task configuration.
			uglify: {
				options: {
					banner: "<%= banner %>",

					compress: {
						dead_code: true
					}
				},
				plugins: {
					files: [
						{
							expand: true,
							cwd: 'plugins/',
							src: ['**/*.js', '!*.min.js', '!**/*.min.js'],
							dest: 'plugins/',
							ext: '.min.js',
							extDot: 'last'
						},
						{
							expand: true,
							cwd: '',
							src: ['onespot-lazysizes*.js', '!*.min.js'],
							dest: '',
							ext: '.min.js',
							extDot: 'last'
						}
					]
				}
			},
			jshint: {
				all: {
					options: {
						jshintrc: true
					},
					src: [ "onespot-lazysizes.js", "plugins/**/*.js", "!*.min.js", "!plugins/**/*.min.js" ] //, "Gruntfile.js", "tests/*.js"
				}
			},
			plato: {
				all: {
					files: {
						"plato-report/": ["onespot-lazysizes.js", "plugins/**/*.js", "!*.min.js", "!plugins/**/*.min.js"]
					}
				}
			},
			qunit: {
				all: ['tests/*.html']
			},
			watch: {
				gruntfile: {
					files: [ "Gruntfile.js", "onespot-lazysizes.js" ],
					tasks: [ "default" ]
				}
			},
			bytesize: {
				all: {
					src: [ "onespot-lazysizes.min.js" ]
				}
			},
			uncss: {
				dist: {
					files: {
						'assets/css/tidy.css': ['index.html', 'maxdpr/*.html']
					}
				}
			},
			maxFilesize: {
				options: {
					// Task-specific options go here.
				},
				minified: {
					options: {
						maxBytes: (1024 * 6.8)
					},
					src: ["onespot-lazysizes.min.js"]
				}
			}
		});

		// These plugins provide necessary tasks.
		grunt.loadNpmTasks("grunt-contrib-jshint");
		grunt.loadNpmTasks("grunt-contrib-uglify");
		grunt.loadNpmTasks("grunt-contrib-watch");
		grunt.loadNpmTasks('grunt-uncss');
		grunt.loadNpmTasks('grunt-bytesize');
		grunt.loadNpmTasks('grunt-max-filesize');
		grunt.loadNpmTasks('grunt-plato');
		grunt.loadNpmTasks('grunt-contrib-qunit');

		grunt.registerTask('wrapcore', 'wraps lazysizes into umd and common wrapper.', function() {
			var ls = grunt.file.read('src/onespot-lazysizes-core.js');
			var common = grunt.file.read('src/common.wrapper');
			var umd = grunt.file.read('src/umd.wrapper');

			grunt.file.write('onespot-lazysizes.js', common.replace('{{ls}}', ls));
			grunt.file.write('onespot-lazysizes-umd.js', umd.replace('{{ls}}', ls));
		});


		// Default task.
		grunt.registerTask("default", [ "wrapcore", "test", "uglify", "bytesize", "maxFilesize" ]);
		grunt.registerTask("test", [ "jshint" ]);
	};
})();
