const path = require('path')
const webpack = require('webpack')

console.log('输出', path.resolve(__dirname, 'dist'))
const ROOT_PATH = path.resolve(__dirname);

module.exports = {
    entry: ['webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/index.js'],
    output: {
        filename: 'bundle.js',
        publicPath: "/assets/",
        path: path.resolve(__dirname, 'dist')
    },
    'mode': 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules|vendor|bootstrap/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            react: 'anujs',
            'react-dom': 'anujs'
        }
    },
    devServer: {
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        hot: true,
        headers: { "X-Custom-Header": "yes" },
        historyApiFallback: true,
        inline: true, //注意：不要写colors:true，progress:true等，webpack2.x已不支持这些
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
