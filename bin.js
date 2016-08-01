#!/usr/bin/env node

var postsass = require('./');
var argv = require('subarg')(process.argv.slice(2));
var log = require('@quarterto/log-promise')(
	'written css',
	err => err.stack
);

argv.postCss = [].concat(argv.postCss || []).map(plugin => [
	plugin._[0],
	plugin,
]);

log(postsass.writeToFile(argv)).catch(() => process.exit(1));
