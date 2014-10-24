module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				banner: "/*! <%= pkg.name %>, Version <%= pkg.version %> (<%= grunt.template.today('yyyy/mm/dd') %>) */\n"
			},
			main: {
				src: ["src/fuel.js"],
				dest: "dist/<%= pkg.name %>-v<%= pkg.version %>.concat.js"
			}
		},

		min: {
			main: {
				src: "dist/<%= pkg.name %>-v<%= pkg.version %>.concat.js",
				dest: "dist/<%= pkg.name %>-v<%= pkg.version %>.min.js",
			}
		}
	});

	// Load the plugin that provides the "concat" task.
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Load the plugin that provides the "min" task.
	grunt.loadNpmTasks('grunt-yui-compressor');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'min']);

};
