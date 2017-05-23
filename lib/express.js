'use strict';
const fs = require('fs');
const path = require('path');

function Express() {
	this._routers = {};
}

Express.prototype.use = function(path, handle = () => {}) {
	this._routers[path] = handle;
}

Express.prototype.handle = function(req, res) {
	if(this._routers[req.pathName]) {
		this._routers[req.pathName](req, res);
	}
}

Express.prototype.serverStatic = function(_path, req, res) {
	const reg = /\/static\/src(.+)/g;
	const src = reg.exec(req.pathName)[1];
	const url = path.join(_path, src);
		fs.stat(url, (err, stat) => {
			if(err || !stat.isFile()) {
				res.statusCode = 404;
				res.end('404');
			}
			const rs = fs.createReadStream(url);
			rs.pipe(res);
		})
}

module.exports = Express;