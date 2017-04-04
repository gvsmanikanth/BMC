/*global require */
'use strict';

var gulpConfiguration = process.argv.slice(2)[0];

if(gulpConfiguration === 'watch') {
	gulpConfiguration = 'default';
}

var configuration = require('./buildconfigs/' + gulpConfiguration);

require('./build/tasks')(configuration);
