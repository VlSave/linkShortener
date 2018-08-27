const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './frontend/js/main.js',
  output: {
    path: path.resolve(__dirname, 'server/assets/js'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  node: {
    fs: 'empty'
  }
};
