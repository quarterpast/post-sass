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
  file: path.join(scssPath, 'style.scss'),
  output: path.join(cssPath, 'style.css'),
  includePaths: [scssPath, bowerPath],
  postCss: []
};

module.exports = (options) => {
  options = defaults(options, defaultOptions);
  options.includePaths = [].concat(options.includePaths);
  return renderScss(options)
  .then(result => postcss(
    options.postCss.map(p => require(p))
  ).process(result.css));
};

module.exports.writeToFile = (options) => {
  options = defaults(options, defaultOptions);
  return mkdirp(options.cssPath)
	.then(() => module.exports(options))
	.then(css => fs.writeFile(options.output, css, 'utf8'));
};
