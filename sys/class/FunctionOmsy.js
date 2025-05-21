const path = require('path');

class FunctionOmsy {
	constructor(CMS, app, server, socket) {
		this.functions = {};
		CMS.loadFiles(path.join(__dirname, '../function'), 'function');
	}
}

module.exports = FunctionOmsy