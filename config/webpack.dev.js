const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

let website = {
    publicPath: 'http://localhost:8888/'
}
module.exports={
    mode: 'development',
    entry: {
        main: './src/main.js',
        main2: './src/main2.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: website.publicPath
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                            {
                                loader: 'css-loader'
                            },
                            {
                                loader: 'postcss-loader',
                                options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
                                    plugins: (loader) => [
                                        require('autoprefixer')(), //CSS浏览器兼容
                                    ]
                                }
                            }
                        ]
                })
                // use:[
                //     {loader: 'style-loader'},
                //     {loader: 'css-loader'}
                // ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)/,
                use:[{
                    loader: 'url-loader',
                    options:{
                        limit:500,
                        outputPath: 'images/'
                    }
                }]
            },
            {
                test: /\.(html|html)$/i,
                use:['html-withimg-loader']
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use:[
                        {loader: 'css-loader'},
                        {loader: 'less-loader'}
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use:[
                        {loader: 'css-loader'},
                        {loader: 'sass-loader'}
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_moudles/
            }
        ]
    },
    plugins: [
        new uglify(),
        new htmlPlugin({
            minify:{
                removeAttributeQuotes: true
            },
            hash: true,
            template: './src/index.html'
        }),
        new PurifyCSSPlugin({
            paths: glob.sync(__dirname, 'src/*.html')
        }),
        new extractTextPlugin('css/index.css')
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        host: 'localhost',
        compress: true,
        port: 8888
    }
}