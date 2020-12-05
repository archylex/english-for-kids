const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/index.js',
  resolve: {
    modules: [
      path.resolve(__dirname, "assets"),
      "node_modules"
    ],
  },
  performance: {
    hints: false
  },
  module: {
    rules: [      
      { test: /\.(png|svg|jpg|gif)$/, use: [ 'file-loader' ] }, 
      { test: /\.s[ac]ss$/i, use: [ 'style-loader', 'css-loader', {
        loader: 'sass-loader',
        options: {       
          implementation: require('sass'),
        },
      } ] },                 
      { test: /\.(js)$/, use: 'babel-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
        title: 'English for kids',
        template: './templates/index.html'
      }),
    new CopyPlugin({
      patterns: [
        { from: "views", to: "views" },
        { from: "assets", to: "assets" },
      ],
    }),
  ]
}