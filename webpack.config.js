var webpack = require('webpack');
var path = require('path');
var uglifyjs = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const entry = {
	home: path.join(__dirname, 'public/page/home.js'),
}

module.exports = {
	entry: entry,
	output: {
		filename: '[name].min.js',
		path: path.join(__dirname, '/assets'),
		publicPath: 'http://localhost:4444/assets/',
	},
	module: {
		rules: [
			{ test: /\.css$/, use: ["css-loader", "style-loader"] },
			{ test: /\.less$/, use: ["css-loader", "style-loader", "less-loader"] },
			{
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
			{
				test: /\.js$/,
				loader: "babel-loader",
				query: {
					presets: [
						require.resolve('babel-preset-stage-0'),
						require.resolve('babel-preset-react'),
						require.resolve('babel-preset-es2015'),
					]
				}
			},
			{ test:/\.(png|jpg|jpeg)$/, use: ["file-loader", "image-webpack-loader", {
				loader: "url-loader",
				options: {
					limit: 8142,
					name: 'images/[name].[ext]',
				}
			}] }
		]
	},
	devServer: {
    port: 4444,
  },
	plugins: [
		new ExtractTextPlugin('[name].min.css'),
		new uglifyjs({
			sourceMap: true
		})
	],
};