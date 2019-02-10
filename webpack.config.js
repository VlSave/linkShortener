const path = require('path');
const argv = require('yargs').argv;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;

module.exports = {
  devtool: 'source-map',
  entry: './client/main.js',
  output: {
    path: path.resolve(__dirname, 'server/assets'),
    publicPath: '/assets',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                isProduction ? require('cssnano') : () => {},
                require('autoprefixer')({
                  browsers: ['last 2 versions']
                })
              ]
            }
          },
          'sass-loader'
        ]
      }, {
        test: /\.(gif|png|jpeg|jpg|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '/images/[name][hash].[ext]'
          }
        }, {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 70
            }
          }
        },
        ],
      }, {
        test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '/fonts/[name][hash].[ext]'
          }
        },
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css'
    })
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  node: {
    fs: 'empty'
  }
};
