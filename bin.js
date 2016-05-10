#!/usr/bin/env node

var postsass = require('./');
var argv = require('minimist')(process.argv.slice(2));
var log = require('@quarterto/log-promise')(
	'written css',
	err => err.stack
);

log(postsass.writeToFile(argv)).catch(() => process.exit(1));
