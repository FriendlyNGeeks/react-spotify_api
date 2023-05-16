const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: './.env.local' });


module.exports = {
  mode: 'production',
  // mode: 'development',
  // devtool: 'inline-source-map',
  entry: path.resolve(__dirname, './src/index.js'),
  plugins: [
    new webpack.DefinePlugin({'process.env' : JSON.stringify(process.env)}),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              '@babel/preset-env', {
                targets: {
                  esmodules: true
                }
              }],
              '@babel/preset-react']
          }
        }
      },
      {
        test: [/\.s[ac]ss$/i, /\.css$/i],
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build')
}
};
