const queryString = require('querystring');
const fs = require('fs');
const http = require('http');
const path = require('path');
const util = require('../lib/util');

const saveData = postData => (req, res) => {
	const username = postData.username;
	const { file, sex, email, profile, age, nickname } = postData;
	let originData = {}
	util.readData(data => {
		for(let i = 0, len = data.length; i < len; i++) {
			if(data[i].username === username) {
				originData = data[i];
				data[i] = Object.assign({}, data[i], {
					sex: sex ? sex : data[i]['sex'],
					email: email ? email : data[i]['email'],
					profile: profile ? profile : data[i]['profile'],
					age: age ? age : data[i]['age'],
					avatar: file ? file : data[i]['avatar'],
					nickname: nickname ? nickname : data[i]['nickname']
				});
				break;
			}
		}
		data = JSON.stringify(data);
		util.writeData(data, () => {
			res.end(JSON.stringify({
				code: 0,
				message: 'success',
			}));
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
			postData = JSON.parse(postData);
			const { file, avatarUrl } = postData;
			if(file && avatarUrl) {
				const base64Data = avatarUrl.replace(/^data:image\/\w+;base64,/, "");
				const dataBuffer = new Buffer(base64Data, 'base64');
				fs.writeFile(path.join(__dirname, '../static/src/images/', file), dataBuffer, function(err) {
	        if(err){
	        	res.end(SON.stringify({
							code: 1,
							message: 'upload fail',
						}));
	        } else {
	          saveData(postData)(req, res);
	        }
	    	});
			} else {
				saveData(postData)(req, res);
			}
		});
	},
	getUserInfo: (req, res) => {
		const username = req.queryString.username;
		util.readData(data => {
			for(let i = 0, len = data.length; i < len; i++) {
				if(data[i].username === username) {
					res.end(JSON.stringify(data[i]));
					break;
				}
			}
		});
	}
};