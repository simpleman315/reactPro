var path = require('path');

var src = {
  path: path.resolve(__dirname, './static/src/'),
  urlPath: './static/src/',
  js: path.resolve(__dirname, './static/src/js/'),
  css: path.resolve(__dirname, './static/src/css/'),
  views: path.resolve(__dirname, './views/')
};

var config = {
  src: src
};

module.exports = config;