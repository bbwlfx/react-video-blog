'use strict';
const http = require('http');
const express = require('./lib/express');
const util = require('./lib/util');
const path = require('path');

const loginRouter = require('./routers/loginController');
const errorRouter = require('./routers/errorController');
const homeRouter = require('./routers/homeController');

const app = new express();

const server = http.createServer((req, res) => {

	util.parseUrl(req, res);
	util.parseCookie(req, res);
	
	if(req.pathName.indexOf('/static/src') >= 0) {
		app.serverStatic(path.join(__dirname, '/static/src'), req, res);	
	}

	app.use('/', loginRouter.render('login'));
	app.use('/form', loginRouter.render('login'));
	app.use('/form/login', loginRouter.handleLogin);
	app.use('/form/register', loginRouter.render('register'));
	app.use('/form/addUser', loginRouter.handleRegister);
	app.use('/form/login/error', errorRouter.render({
		status: '403',
		errMsg: 'username or password error',
	}));
	app.use('/form/register/error', errorRouter.render({
		status: '403',
		errMsg: 'user had existed...'
	}));

	app.use('/home', homeRouter.render);
	app.use('/upload', homeRouter.handleUpload);

	app.handle(req, res);

}).listen(4567, () => {
	console.log('server is running at port 4567...');
});