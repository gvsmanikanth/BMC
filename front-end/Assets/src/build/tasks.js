/*jshint strict: true, node: true */
/*global console */
'use strict';

var gulp = require('gulp'),
	rev = require('gulp-rev-all'),
	rimraf = require('rimraf'),
	StreamLoader = require('./lib/StreamLoader'),
	TaskLoader = require('./lib/TaskLoader'),
	WatchLoader = require('./lib/WatchLoader');


module.exports = function(configuration) {
	// load up autoclean tasks and drivers
	var loader = new TaskLoader(gulp, configuration);
	loader.loadTasks();

	// this is the debug build task
	gulp.task('default', loader.getBuildDependencies(), function() {
		var masterStream,
			sLoader = new StreamLoader(gulp, configuration);

		sLoader.loadStreams(true);

		masterStream = sLoader.getTaskStreams();

		masterStream = sLoader.executeCustomOutput(masterStream);

		return masterStream.pipe(gulp.dest(configuration.output));
	});

	gulp.task('aem', ['default'], function() {
		// copies files from FED build location to a corresponding location for vlt to bundle and deploy to aem
		// main client lib
		gulp.src('./../dist/main.js')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/main/js'));

		// head client lib
		gulp.src('./../dist/head.js')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/head/js'));
		gulp.src('./../dist/style.css')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/head/css'));

		// css images
		gulp.src('./../dist/**/*')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/head'));

	});

	//aem-production command to publish JS and CSS in minified format.
	gulp.task('aem-production', ['aem-minification'], function() {
		// copies files from FED build location to a corresponding location for vlt to bundle and deploy to aem
		// main client lib
		gulp.src('./../dist/main.js')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/main/js'));

		// head client lib
		gulp.src('./../dist/head.js')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/head/js'));
		gulp.src('./../dist/style.css')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/head/css'));

		// css images
		//gulp.src('./../dist/**/*') // WEB-2331 : commented, becasue no need to update individual source code js/css files to AEM)
		//Promoting only image files.
		gulp.src('./../dist/**/*')
			.pipe(gulp.dest('./../../../aem-project/ui.apps/src/main/content/jcr_root/etc/clientlibs/bmc/head'));

	});

	gulp.task('aem-minification', loader.getBuildDependencies(), function() {
		// copies files from FED build location to a corresponding location for vlt to bundle and deploy to aem
		// main client lib

		var masterStream,
		sLoader = new StreamLoader(gulp, configuration);

		if(configuration.cleanProduction) {
			rimraf.sync(configuration.output);
		}

		sLoader.loadStreams(false);

		masterStream = sLoader.getTaskStreams();

		if (configuration.cacheBusting) {
			// rev stamps all files with a hash for cache-busting
			// ignores php files and contents of /img/content directory.
			masterStream = masterStream.pipe(rev({ ignore: ['.php', /img\/content/] }));
		}

		masterStream = sLoader.executeCustomOutput(masterStream);

		return masterStream.pipe(gulp.dest(configuration.output));

	});

	// this is the top level production task (minified, no sourcemaps, rev'd)
	gulp.task('production', loader.getBuildDependencies(), function() {
		var masterStream,
			sLoader = new StreamLoader(gulp, configuration);

		if(configuration.cleanProduction) {
			rimraf.sync(configuration.output);
		}

		sLoader.loadStreams(false);

		masterStream = sLoader.getTaskStreams();

		if (configuration.cacheBusting) {
			// rev stamps all files with a hash for cache-busting
			// ignores php files and contents of /img/content directory.
			masterStream = masterStream.pipe(rev({ ignore: ['.php', /img\/content/] }));
		}

		masterStream = sLoader.executeCustomOutput(masterStream);

		return masterStream.pipe(gulp.dest(configuration.output));
	});

	gulp.task('watch', ['default'], function() {
		var watches = new WatchLoader(configuration);

		watches.startWatching(configuration.tasks);

		console.log('\nPress Ctrl-C to stop watching.');
	});

	gulp.task('servicecloud', loader.getBuildDependencies(), function() {
		var masterStream,
			sLoader = new StreamLoader(gulp, configuration);

		sLoader.loadStreams(false);

		masterStream = sLoader.getTaskStreams();

		masterStream = sLoader.executeCustomOutput(masterStream);

		return masterStream.pipe(gulp.dest(configuration.output));
	});

	gulp.task('allianceProgram', loader.getBuildDependencies(), function() {
		var masterStream,
			sLoader = new StreamLoader(gulp, configuration);

		sLoader.loadStreams(false);

		masterStream = sLoader.getTaskStreams();

		masterStream = sLoader.executeCustomOutput(masterStream);

		return masterStream.pipe(gulp.dest(configuration.output));
	});

	gulp.task('onGig', loader.getBuildDependencies(), function() {
		var masterStream,
		sLoader = new StreamLoader(gulp, configuration);

		sLoader.loadStreams(false);

		masterStream = sLoader.getTaskStreams();

		masterStream = sLoader.executeCustomOutput(masterStream);

		return masterStream.pipe(gulp.dest(configuration.output));
	});
};
