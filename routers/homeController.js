const queryString = require('querystring');
const fs = require('fs');
const http = require('http');
const path = require('path');
const util = require('../lib/util');

const saveData = postData => (req, res) => {
	const co = req.cookies;
	const username = co['username'];
	const { file, sex, email, profile, age, nickname } = postData;
	util.readData(data => {
		for(let i = 0, len = data.length; i < len; i++) {
			if(data[i].username === username) {
				data[i] = Object.assign({}, data[i], {
					sex: sex ? sex : co['sex'],
					email: email ? email : co['email'],
					profile: profile ? profile : co['profile'],
					age: age ? age : co['age'],
					avatar: file ? file : co['avatar'],
					nickname: nickname ? nickname : co['nickname']
				});
				break;
			}
		}
		data = JSON.stringify(data);
		util.writeData(data, () => {
			res.setHeader('Set-Cookie', [
				'has_login=yes;path=/',
				`username=${username || ''};path=/`,
				`avatar=${file || co['avatar']};path=/`,
				`email=${email || co['email']};path=/`,
				`sex=${sex || co['sex']};path=/`,
				`profile=${profile || co['profile']};path=/`,
				`nickname=${nickname || co['nickname']};path=/`,
				`age=${age || co['age']};path=/`
			]);
			res.statusCode = 302;
			res.setHeader('Location', '/home');
			res.end();
		});
	});
};

module.exports = {
	render: (req, res) => {
		if(req.cookies["has_login"]) {
			const map = ['username', 'sex', 'email', 'profile', 'avatar', 'nickname', 'age'];
			const userInfo = {};
			map.map(value => {
				userInfo[value] = req.cookies[value]
			})
			util.renderFile('home.pug', {
				userInfo: JSON.stringify(userInfo),
			})(req, res);
		} else {
			res.statusCode = 302;
			res.setHeader('Location', '/');
			res.end();
		}
	},
	handleUpload: (req, res) => {
		let postData = '';
		req.on('data', (chunk) => {
			postData += chunk;
		});
		req.on('end', () => {
			postData = queryString.parse(postData);
			const { file, avatarUrl } = postData;
			if(file && avatarUrl) {
				const base64Data = avatarUrl.replace(/^data:image\/\w+;base64,/, "");
				const dataBuffer = new Buffer(base64Data, 'base64');
				fs.writeFile(path.join(__dirname, '../static/src/images/', file), dataBuffer, function(err) {
	        if(err){
	        	res.end('error');
	        } else {
	          saveData(postData)(req, res);
	        }
	    	});
			} else {
				saveData(postData)(req, res);
			}
		});
	}
};