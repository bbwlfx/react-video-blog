'use strict';
const url = require('url');
const path = require('path');
const pug = require('pug');
const queryString = require('querystring');
const fs = require('fs');

const fileUrl = path.join(__dirname, '../static/user.json');

module.exports = {
	parseUrl: (req, res) => {
		req.parseUrl = url.parse(req.url);
		req.pathName = req.parseUrl.pathname;
		if(req.method === "GET") {
			req.queryString = queryString.parse(req.parseUrl.query);
		}
	},
	renderFile: (filename, data = '') => (req, res) => {
		const _html = pug.renderFile(path.join(__dirname, '../template/', filename), data);
		res.end(_html);
	},
	parseCookie: (req, res) => {
		let cookie = req.headers['cookie'];
		req.cookies = cookie ? cookie.split(';').reduce((ret, tmp) => {
			let arr = tmp.split('=');
			ret[arr[0].trim()] = arr[1].trim();
			return ret;
		}, {}) : {};
	},
	readData: callback => {
		fs.stat(fileUrl, (err, stat) => {
				if(err || !stat.isFile()) {
					return false;
				}
				fs.readFile(fileUrl, 'utf-8', (err, data) => {
					if(err) {
						console.log('error:', err);
						return;
					}
					data = JSON.parse(data);
					callback(data);
				})
			})
	},
	writeData: (data, callback) => {
		fs.writeFile(fileUrl, data, 'utf-8', (err) => {
			if(err) {
				console.log(err);
				return false;
			}
			callback();
		})
	},
}
