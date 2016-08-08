#!/usr/bin/env node

var postsass = require('./');
var argv = require('subarg')(process.argv.slice(2));
var log = require('@quarterto/log-promise')(
	'written css',
	err => err.stack
);
var hjson = require('hjson');

argv.postCss = [].concat(argv.postCss || []).map(plugin => plugin._ ? {
	name: plugin._[0],
	options: Object.assign(plugin, hjson.parse(plugin._[1] || '')),
} : {plugin: plugin, options: {}});

log(postsass.writeToFile(argv)).catch(() => process.exit(1));
