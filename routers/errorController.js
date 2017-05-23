const util = require('../lib/util');

module.exports = {
	render: data => util.renderFile('error.pug', data),
};