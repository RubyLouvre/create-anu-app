const path = require('path')
console.log('输出', path.resolve(__dirname, 'dist'))
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  'mode': 'development',
  module: {
    rules: [
      { test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules|vendor|bootstrap/
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.jsx'],
    alias: {
      react: 'anujs',
      'react-dom': 'anujs'
    }
  }
}
