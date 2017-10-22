const queryString = require('querystring');
const fs = require('fs');
const http = require('http');
const path = require('path');
const BusBoy = require('busboy');
const util = require('../lib/util');
const command = require('../mysql/command');

const saveData = postData => (req, res) => {
	const username = req.cookies.username;
	const { file, sex, email, profile, age, nickname } = postData;
	let originData = {};

	delete postData.username;

	for(let prop in postData) {
		let p = prop;
		if(postData[prop]) {
			if(prop === 'file') {
				p = 'avatar';
			}
			global.connection.query(command.updateField[p], [encodeURIComponent(postData[prop]), username], (err, rows) => {
				if(err) {
					console.log(`[update ${prop} error!]:`, err);
					res.end(JSON.stringify({
						code: 1,
						message: `update ${prop} fail`,
					}));
					return;
				}
				console.log(`update ${prop} succeed!]`);
				res.end(JSON.stringify({
					code: 0,
					message: 'success',
				}));
			});
		}
	}
};
const saveLocalVideo = (data) => (req, res) => {
	const username = req.cookies.username;
	const { img, src, source, name } = data;
	console.log(data);
	new Promise((resolve, reject) => {
		global.connection.query(command.selectUid, [username], (err, rows) => {
			if(err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	}).then((rows) => {
		return rows[0].id;
	}, (err) => {
		console.log('[save local video error!]:', err);
	}).then((uid) => {
		global.connection.query(command.saveLocalVideo, [uid, img, src, source, name], (err, rows) => {
			if(err) {
				console.log('[save local video error!]:', err);				
			}
			console.log('[save local video succeed!]');		
			res.end(JSON.stringify({
				code: 0,
				message: 'upload video success'
			}));
		});
	});
}
const saveVideoList = (allData) => (req, res) => {
	const username = req.cookies.username;
	const { title, av, img, time, up } = allData.data;
	const { view, favorite, danmaku, share } = allData.detail.data;
	new Promise((resolve, reject) => {
		global.connection.query(command.selectUid, [username], (err, rows) => {
			if(err) {
				reject(err);
				return;
			}
			resolve(rows);
		});
	}).then((rows) => {
		return rows[0].id;
	}, (err) => {
		console.log('[save video error!]:', err);
	}).then((uid) => {
		console.log('uid:', uid);
		global.connection.query(command.saveVideo, [uid, encodeURIComponent(title), av, img, time, view, favorite, danmaku, share, encodeURIComponent(up), allData.source], (err, rows) => {
			if(err) {
				console.log('[save video error!]:', err);				
				return;
			}
			console.log('[save video succeed!]');	
			res.end(JSON.stringify({
				code: 0,
				message: 'upload video success'
			}));	
		});
	});
}
module.exports = {
	render: (req, res) => {
		if(req.cookies["has_login"] === 'yes') {
			const userInfo = {
				username: req.cookies['username']
			};
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
			if(postData.av) {
				let allData = null;
				http.get(`http://www.jijidown.com/Api/AvToCid/${postData.av}`, result => {
					if(result.statusCode !== 200) {
						res.end(JSON.stringify({
							code: 1,
							message: 'upload video fail',
						}));
					}
					let data = '';
					result.on('data', chunk => {
						data += chunk;
					})
					result.on('end', () => {
						data = JSON.parse(data);
						http.get(`http://api.bilibili.com/archive_stat/stat?aid=${postData.av}`, response => {
							if(res.statusCode !== 200) {
								res.end(JSON.stringify({
									code: 1,
									message: 'upload video fail',
								}));
							}
							let detail = '';
							response.on('data', chunk => {
								detail += chunk;
							});
							response.on('end', () => {
								detail = JSON.parse(detail);
								allData = Object.assign({}, {
									data,
									detail,
									source: postData.source
								});
								saveVideoList(allData)(req, res);
							})
						})
						
					})
				})
				return true;
			}
			const { file, avatarUrl } = postData;
			if(file && avatarUrl) {
				const base64Data = avatarUrl.replace(/^data:image\/\w+;base64,/, "");
				const dataBuffer = new Buffer(base64Data, 'base64');
				fs.writeFile(path.join(__dirname, '../static/src/images/', encodeURIComponent(file)), dataBuffer, function(err) {
	        if(err){
	        	res.end(JSON.stringify({
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
		new Promise((resolve, reject) => {
			global.connection.query(command.selectUserByName, [username], (err, rows, fields) => {
				if(err) {
					reject(err);
					return;
				}
				resolve(rows[0]);
			});
		}).then((user) => {
			global.connection.query(command.selectVideoList, [user.id], (err, rows) => {
				if(err) {
					console.log('[get userinfo error!]:', err);
					return;
				}
				console.log('[get userinfo succees!]');
				const data = Object.assign({}, user, { videoList: rows });
				res.end(JSON.stringify(data));
			})
		}, (err) => {
			console.log('[get userinfo error!]:', err);
		});
	},
	handleUploadVideo: (req, res) => {
		let fileName = null;
		const username = req.cookies.username;
		let saveTo = null;
		
		const busboy = new BusBoy({
			headers: req.headers
		});
		busboy.on('file', (fieldname, file, filename) => {
			fileName = filename;
			saveTo = path.join(__dirname, '../static/src/videos/', encodeURIComponent(filename));
			file.pipe(fs.createWriteStream(saveTo));
		});
		busboy.on('finish', () => {
			saveLocalVideo({
				img: '',
				src: path.join(__dirname, '../static/src/videos', encodeURIComponent(fileName)),
				source: 'local',
				name: encodeURIComponent(fileName)
			})(req, res);
		});
		req.pipe(busboy);
	}
};