const queryString = require('querystring');
const fs = require('fs');
const http = require('http');
const path = require('path');
const BusBoy = require('busboy');
const util = require('../lib/util');

const saveData = postData => (req, res) => {
	const username = req.cookies.username;
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
					avatar: file ? encodeURIComponent(file) : data[i]['avatar'],
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
const saveVideoList = (allData) => (req, res) => {
	const username = req.cookies.username;
	const { title, av, img, time, up } = allData.data;
	const { view, favorite, danmaku, share } = allData.detail.data;
	util.readData(data => {
		for(let i = 0, len = data.length; i < len; i++) {
			if(data[i].username === username) {
				const videoList = data[i].videoList;
				videoList.push({
					title,
					av,
					img,
					time,
					view,
					favorite,
					danmaku,
					share,
					up,
					source: allData.source
				})
				data[i] = Object.assign({}, data[i], { videoList });
				break;
			}
		}
		data = JSON.stringify(data);
		util.writeData(data, () => {
			res.end(JSON.stringify({
				code: 0,
				message: 'upload video success'
			}));
		})
	})
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
		util.readData(data => {
			for(let i = 0, len = data.length; i < len; i++) {
				if(data[i].username === username) {
					res.end(JSON.stringify(data[i]));
					break;
				}
			}
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
			const extractPath = path.join(__dirname, '../static/src/images/', `${fileName}-cover.jpg`);
			util.readData(data => {
				for(let i = 0, len = data.length; i < len; i++) {
					if(data[i].username === username) {
						const videoList = data[i].videoList;
						videoList.push({
							img: '',
							src: path.join(__dirname, '../static/src/videos', encodeURIComponent(fileName)),
							source: 'local',
							name: encodeURIComponent(fileName)
						})
						data[i] = Object.assign({}, data[i], { videoList });
						break;
					}
				}
				data = JSON.stringify(data);
				util.writeData(data, () => {
					res.end(JSON.stringify({
						code: 0,
						message: 'upload video success'
					}));
				})
			})
			
		});
		req.pipe(busboy);
	}
};