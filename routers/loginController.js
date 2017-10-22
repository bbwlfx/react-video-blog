'use strict';
const path = require('path');
const util = require('../lib/util');
const queryString = require('querystring');
const fs = require('fs');
const connection = require('../mysql/');
const command = require('../mysql/command');

module.exports = {
	render: filename => util.renderFile(`${filename}.pug`),
	handleLogin: (req, res) => {
		let postData = '';
		req.on('data', (chunk) => {
			postData += chunk;
		});
		req.on('end', () => {
			req.userInfo = queryString.parse(postData);
			new Promise((resolve, reject) => {
				connection.query(command.selectUser, (err, rows, fields) => {
					if(err) {
						reject(err);
						return;
					}
					resolve(rows);
				});
			}).then((rows) => {
				let exist = false;
				for(let i = 0; i < rows.length; i++) {
					if(rows[i].username === req.userInfo.username && rows[i].password === req.userInfo.password) {
						exist = true;
						req.userInfo.detail = rows[i];
						break;
					}
				}
				if(exist) {
					const { username } = req.userInfo.detail;
					res.setHeader('Set-Cookie', [
						'has_login=yes;path=/',
						`username=${username || ''};path=/`,
					]);
					res.setHeader('Location', '/home');
					res.statusCode = 302;
					res.end();
					return;
				} else {
					console.log('[user is not existed...]');
					res.statusCode = 302;
					res.setHeader('Location', '/form/login/error');
					res.end();
				}
			}, () => {
				console.log('[select user error!:]', err.sqlMessage);
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
			new Promise((resolve, reject) => {
				global.connection.query(command.selectUserName, (err, rows, fields) => {
					if(err) {
						reject(err);
						return;					
					}
					resolve(rows);
				});
			}).then((rows) => {
				const exist = rows.some(item => item.username === req.userInfo.username);
				if(exist) {
					res.statusCode = 302;
					res.setHeader('Location', '/form/register/error');
					res.end();
					return false;
				}
				return true;
			}, (err) => {
				console.log('[select error!]:', err.sqlMessage);
				return false;
			}).then((flag) => {
				if(flag) {
					connection.query(command.insertUser, [req.userInfo.username, req.userInfo.password, 'New User', 'avatar-default.png', 'none', 'male', 'none', 0], (err, rows, fields) => {
						if(err) {
							console.log('[insert error!]:', err.sqlMessage);
							return false;
						}
						console.log('[insert data succeed!]');
						util.renderFile('register-success.pug')(req, res);						
						return true;
					});
				}
			});
		})
	}
}