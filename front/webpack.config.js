const webpack = require('webpack');

//const WebpackPwaManifest = require('webpack-pwa-manifest');
//const { InjectManifest } = require('workbox-webpack-plugin');
// const manifest = require('./public/manifest.json');
// const pwaPlugin = new WebpackPwaManifest(manifest);

// const workboxPlugin = new InjectManifest({
//     swSrc: './src/sw.js',
//     swDest: 'sw.js',
// });

module.exports = {

    entry: './src/index.js',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },
    devServer: {
        hot: true,
        inline: true,
        host: 'humanwater.insoo',
        //host: '0.0.0.0',
        port: 9500,
        contentBase: __dirname + '/public/',
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,

                options: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                loader: 'style-loader!css-loader!sass-loader'
            },
            {
                test: /\.(jpg|png|gif|jpeg|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=1000'
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.json', '.jsx', '.css'],
    },
    plugins: [ new webpack.HotModuleReplacementPlugin(), ]
    //pwaPlugin, workboxPlugin
};