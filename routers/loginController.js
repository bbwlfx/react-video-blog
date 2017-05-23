'use strict';
const path = require('path');
const util = require('../lib/util');
const queryString = require('querystring');
const fs = require('fs');

module.exports = {
	render: filename => util.renderFile(`${filename}.pug`),
	handleLogin: (req, res) => {
		let postData = '';
		req.on('data', (chunk) => {
			postData += chunk;
		});
		req.on('end', () => {
			req.userInfo = queryString.parse(postData);
			util.readData(data => {
				let exist = false;
				for(let i = 0, len = data.length; i < len; i++) {
					if(data[i].username === req.userInfo.username && data[i].password === req.userInfo.password) {
						req.userInfo.detail = data[i];
						exist = true;
						break;
					}
				}
				if(exist) {
					const { username, avatar, email, sex, profile, nickname, age } = req.userInfo.detail;
					res.setHeader('Set-Cookie', [
						'has_login=yes;path=/',
						`username=${username || ''};path=/`,
					]);
					res.setHeader('Location', '/home');
					res.statusCode = 302;
					res.end();
				} else {
					res.statusCode = 302;
					res.setHeader('Location', '/form/login/error');
					res.end();
				}
			});
		})
	},
	handleRegister: (req, res) => {
		let postData = '';
		req.on('data', (chunk) => {
			postData += chunk;
		});
		req.on('end', () => {
			req.userInfo = queryString.parse(postData);
			util.readData(data => {
				const exist = data.some(obj => obj.username === req.userInfo.username && obj.password === req.userInfo.password);
				if(exist) {
					res.statusCode = 302;
					res.setHeader('Location', '/form/register/error');
					res.end();
				} else {
					data.push({
						"username": req.userInfo.username,
						"nickname": "nickname",
						"password": req.userInfo.password,
						"avatar": '',
						"email": '',
						"sex": '',
						"profile": '',
						"age": '',
						"videoList": [],
					});
					data = JSON.stringify(data);
					util.writeData(data, () => {
						util.renderFile('register-success.pug')(req, res);
					});
				}
			});
		})
	}
}