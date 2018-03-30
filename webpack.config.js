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

    return plugins;
}

const config = {
  mode: process.env.NODE_ENV !== 'dev' ? 'production' : 'development',
  entry: './src/asteroids.ts',
  optimization: {
      minimize: false
  },
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
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
      { test: /\.wav/, loader: 'file-loader' }
    ]
  }
};

if (isProd) {
    config.optimization.minimize = true;
}

module.exports = config;