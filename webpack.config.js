// let webpack = require('webpack');

const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env) => {
    const ENV = env ? 'production' : 'development';
    /*eslint-disable*/
    console.log('Now building Hackathon Boilerplate '+ENV.toUpperCase()+' build');
    /*eslint-enable*/

    const plugins = ENV === 'production' ?
    [
        // new ExtractTextPlugin(path.join(__dirname, 'dist/[main].css')),
        new UglifyJSPlugin({
          mangle: false,
          comments: false
        })] : [];

     const config = {
          entry: {
              base: path.join(__dirname, 'ui/js/base.js'),
              index: path.join(__dirname, 'ui/js/index.js'),
              detailView: path.join(__dirname, 'ui/js/detailView.js'),
              userListView: path.join(__dirname, 'ui/js/userListView.js')
          },
          output: {
              path: path.join(__dirname, 'public/scripts'),
              filename: '[name].js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ['babel-loader', 'eslint-loader']
                },
                {
                    test: /(\.woff|\.ttf|\.svg|\.eot|\.gif)/,
                    use: 'url-loader'
                },
                {
                    test: /(\.scss|\.css)/,
                    loader: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: ENV === 'production',
                            },
                        },
                        'postcss-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                includePaths: [
                                    // path.join(__dirname, 'ui/scss/libs'),
                                    path.join(__dirname, 'ui/scss/sass/'),
                                ]
                            }
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: [
                                    path.join(__dirname, 'ui/scss/modules/vars.scss'),
                                    path.join(__dirname, 'ui/scss/modules/mixins.scss')
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            alias: {
                sass: path.resolve(__dirname, 'ui/scss/'),
                js: path.resolve(__dirname, 'ui/js/'),
            }
        },
        plugins
    };

    return config;
};
