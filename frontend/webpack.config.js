var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');

module.exports = {
    entry: [
        // 'webpack-dev-server/client?http://localhost:8080',
        // 'webpack/hot/dev-server',
        path.resolve(__dirname, 'src/index.jsx')
    ],
    output: {
        path: path.resolve(__dirname, 'public', 'res', 'js'),
        filename: 'bundle.js',
        publicPath: '/' // rel path generated in HTML
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: node_modules,
                loader: 'babel'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};