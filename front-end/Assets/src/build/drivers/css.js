/*jshint strict: true, node: true */
/*global console */
'use strict';

var base64 = require('gulp-base64'),
	cssmin = require('gulp-minify-css'),
	gulpif = require('gulp-if'),
	prefix = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	sassdoc = require('sassdoc'),
	sourcemaps = require('gulp-sourcemaps'),
	replace = require('gulp-replace'),
	cmq = require('gulp-combine-media-queries');

var assetPath = {
	local: {
		images: '',
		svg: '',
		fonts: ''
	},
	cdn: {
		images: '//media.cms.bmc.com/designimages/',
		svg: '//media.cms.bmc.com/binary/',
		fonts: '//media.cms.bmc.com/binary/'
	},
	serviceCloud: {
		images: '../img/',
		svg: '../img/',
		fonts: '../fonts/'
	},
	allianceProgram: {
		images: '../img/',
		svg: '../img/',
		fonts: '../fonts/'
	}
};

// assigned within cssDriver.init, used within cssDriver.build
var imagesPath,
	svgPath,
	fontsPath;

var cssDriver = {
	init: function(globalConfig, currentTaskConfig) {
		var assetPathKey = currentTaskConfig.assetPathKey ? currentTaskConfig.assetPathKey : '';
		imagesPath = assetPath[assetPathKey].images;
		svgPath = assetPath[assetPathKey].svg;
		fontsPath = assetPath[assetPathKey].fonts;
		console.log(fontsPath);
	},
	build: function(pipeline, debug) {
		return pipeline
			.pipe(gulpif(debug, sourcemaps.init()))
			.pipe(gulpif(debug, sassdoc({
				basePath: 'https://github.com/connectivedx/Phoenix/tree/master/Assets/src',
				dest: '../dist/sassdoc',
				groups: {
					"grid": "Grid System",
					"semantic-grid": "Semantic Grid System",
					"measurements": "Measurements",
					"options": "Options",
					"transitions": "Transitions",
					"typography": "Typography",
					"undefined": "Helper"
				},
				sort: ["group", "file"],
				theme: "./sassdoc-theme"
			})))
			.pipe(sass())
			.pipe(prefix({
				browsers: ['last 2 versions', 'IE >= 9', 'Android >= 4']
			}))
			.pipe(gulpif(debug, sourcemaps.write('./')))
			.pipe(base64({
				exclude: [/\icomoon/],
				extensions: ['svg']
			}))
			.pipe(cmq())
			.pipe(replace('{{$imagesFolder}}', imagesPath))
			.pipe(replace('{{$svgFolder}}', svgPath))
			.pipe(replace('{{$fontsFolder}}', fontsPath))
			.pipe(gulpif(!debug, cssmin({
				advanced: false
			})));
	}
};

module.exports = cssDriver;