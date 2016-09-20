var config = require('./config');
var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var prod = process.env.NODE_ENV === 'production';
var webpackConfig  = {
    entry: {
		'bundle':'./public/js/main.js',
		'test':'./public/js/test.jsx'
	},
	
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
	
	resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'react']
                }

            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
		new ConfiPlugin()
    ],
	
};

function ConfiPlugin() {}

ConfiPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    var hash = compilation.hash.substr(0, 8);
    var publicPath = prod ? '//static.seeyouyima.com/data.tataquan.com/' + hash + '/' : 'http://127.0.0.1:8080/static/dist/';
    var htmlMap = getHtml();
    htmlMap.forEach(function(name) {
      fs.readFile(name, 'utf-8', function(error, data) {
        if (error) throw error;
        var jsString = data.match(/\<script src=\".+\/js\/.+\.js.+\<\/script\>/g);
        var cssString = data.match(/\<link type="text\/css" rel="stylesheet".+href=\".+\/css\/.+\.css.+\/\>/g);
        var m = [];
        var newString = '';
        if(jsString) {
          jsString.forEach(function(value) {
            m = value.match(/\<script src=\".+\/js\/(.+)\.js/);
            newString = '<script src="' + publicPath + 'js/' + m[1] + '.js"></script>';
            var regExp = new RegExp(value);
            data = data.replace(regExp, newString);
          });
        }
        if(cssString) {
          cssString.forEach(function(value) {
            m = value.match(/\<link.+href=\".+\/css\/(.+)\.css/);
            newString = '<link type="text/css" rel="stylesheet" href="' + publicPath + 'css/' + m[1] + '.css"/>';
            var regExp = new RegExp(value);
            data = data.replace(regExp, newString);
          });          
        }
        fs.writeFile(name, data, 'utf-8', function(error) {
          if (error) throw error;
          console.log('Replace paths of ' + name + ' successfully ...');
        });
      });
    });
    callback();
  });
};

function getHtml() {
  var htmlDir = config.src.views;
  var names = fs.readdirSync(htmlDir);
  var htmlMap = [];
  names.forEach(function(name) {
    var m = name.match(/.+\.html$/);
    if(m) {
      htmlMap.push(path.resolve('./views/' + name));
    }    
  });
  return htmlMap;
}

module.exports = webpackConfig;