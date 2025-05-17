const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/asteroids.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
    },
    devtool: isDev ? 'inline-source-map' : 'source-map',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
            test: /\.css$/,
            use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            ],
        },
        {
          test: /\.wav$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name][ext]',
          },
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
      ],
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        !isDev && new MiniCssExtractPlugin({
        filename: 'style.css',
        }),
    ].filter(Boolean),
    devServer: {
      static: {
        directory: path.join(__dirname, 'build'),
      },
      compress: true,
      port: 9000,
      open: true,
      hot: true,
    },
    mode: isDev ? 'development' : 'production',
  };
};