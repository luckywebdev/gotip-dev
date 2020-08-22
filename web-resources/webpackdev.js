import path from 'path'
const cssModuleRegex = /\.module\.css$/;
const cssRegex = /\.css$/;

const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, '../public')
import HtmlWebpackPlugin from 'html-webpack-plugin' 
import CopyWebpackPlugin from 'copy-webpack-plugin' 

export default {
  mode: 'development',
  entry: ['@babel/polyfill', src + '/index.js'],

  output: {
    path: dist,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 1000,
          name: 'img/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.css$/,
        exclude: cssModuleRegex,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            // options: {
            //   modules: true,
            //   importLoaders: 1,
            //   modules: {
            //     localIdentName: '[name]__[local]__[hash:base64:7]'
            //   }
            // }
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  devServer: {
    port: 8080,
    historyApiFallback: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: src + '/index.html',
      inject: false,
      filename: 'index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [{
      from: src + '/static',
      to: dist + '/static'
    }]})
  ]
}