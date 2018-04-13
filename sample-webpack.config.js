module.exports = {
    entry: [
        './sample-app.js'
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            "env",
                            "react"
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist-sample',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist-sample'
    }
};