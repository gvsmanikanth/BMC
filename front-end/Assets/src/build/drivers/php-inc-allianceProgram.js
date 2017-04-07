/*jshint strict: true, node: true */
/*global console */
'use strict';

var replace = require('gulp-replace');

var exampleDriver = {

	// rewrites templates to reference output specific for paths related to service cloud
	build: function(pipeline, debug) {
		return pipeline
			.pipe(replace(/includes\/(.*\.(css|js))/g, 'assets/$1'))
			// replace font references with the fonts folder
			.pipe(replace(/includes\/(.*\.(eot|svg|ttf|woff))/g, 'fonts/$1'))
			// replace image references with the image folder
			.pipe(replace(/includes\/(.*\.(png|gif|jpg|jpeg))/g, 'img/$1'))
	}
};

module.exports = exampleDriver;