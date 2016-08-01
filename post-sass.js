var scss = require('node-sass');
var postcss = require('postcss');
var renderScss = require('@quarterto/promisify')(scss.render);
var fs = require('fs-promise');
var mkdirp = require('mkdirp-promise');
var defaults = require('lodash.defaults');
var path = require('path');

var scssPath = path.resolve('scss');
var cssPath = path.resolve('css');
var bowerPath = path.resolve('bower_components');

var defaultOptions = {
  scssPath: scssPath,
  cssPath: cssPath,
  filename: 'style.scss',
  includePaths: [scssPath, bowerPath],
  postCss: []
};

var initPlugin = (plugin) => {
  var name = Array.isArray(plugin) ? plugin[0] : plugin;
  var options = Array.isArray(plugin) ? plugin[1] : {};

  return require(name)(options);
};

module.exports = (options) => {
  options = defaults(options, defaultOptions);
  options.includePaths = [].concat(options.includePaths);
  options.postCss = [].concat(options.postCss);
  options.file = options.file || path.join(options.scssPath, options.filename);
  return renderScss(options)
  .then(result => postcss(
    options.postCss.map(initPlugin)
  ).process(result.css));
};

module.exports.writeToFile = (options) => {
  options = defaults(options, defaultOptions);
  options.output = options.output || path.join(options.cssPath, path.basename(options.filename, '.scss') + '.css');
  return mkdirp(options.cssPath)
	.then(() => module.exports(options))
	.then(css => fs.writeFile(options.output, css, 'utf8'));
};
