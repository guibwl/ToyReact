var path = require('path');

module.exports = {
    entry: './main.js',
    optimization: {minimize: false},
    devtool: 'inline-cheap-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                {pragma: 'ToyReact.createElement'}
                            ]
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        index: 'index.htm'
    }
}