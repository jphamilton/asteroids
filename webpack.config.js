var path = require('path');
var webpack = require('webpack');
var isProd = (process.env.NODE_ENV !== 'dev');

function getPlugins() {
    var plugins = [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': process.env.NODE_ENV
            }
        })
    ];

    if (isProd) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: false,
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            }
        }));
    }

    return plugins;
}

module.exports = {  
  entry: './src/asteroids.ts',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'asteroids.js',
    publicPath: "/build/"
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js']
  },
  plugins: getPlugins(),
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.wav/, loader: 'file-loader' }
    ]
  }
}