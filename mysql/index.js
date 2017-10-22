const mysql = require('mysql');
const config = require('../mysql.config');

const connection = mysql.createConnection(config);

module.exports = connection;