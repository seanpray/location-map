const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const env_vars = require('dotenv').config().parsed;

const env_kv = Object.keys(env_vars).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env_vars[next]);
  return prev;
}, {});

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: 'body',
      templateParameters: env_kv,
    }),
    new webpack.DefinePlugin(env_kv),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    server: {
      type: 'https',
      options: {
        key: path.resolve(__dirname, 'key.pem'),
        cert: path.resolve(__dirname, 'cert.pem'),
      },
    },
    hot: true,
  },
  mode: 'development',
};

