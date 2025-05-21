const fs = require('fs');
const path = require('path');

class FunctionOmsy {
	constructor(CMS, app, server, socket) {
		this.functions = {};
    	this.folderFunction = path.join(__dirname, '../../usr/panel');

		this.CMS = CMS
		this.app = app
		this.server = server
		this.socket = socket

		this.loadPage();
	}

	loadPage() {
		const allFiles = fs.readdirSync(this.folderFunction);

		allFiles.forEach((file) => {
			if (file === '.' || file === '..') return;

			const basename = path.basename(file, '.js');
      		const modulePath = path.join(this.folderFunction, file);
      		if (fs.statSync(modulePath).isDirectory()) return;

			console.log(file,basename,modulePath)
			try {
				const func = require(modulePath);

				this.app.get('/'+basename, (req, res) => func(this.CMS, this.app, this.server, this.socket,req, res));
				if(basename === 'Index') this.app.get('/', (req, res) => func(this.CMS, this.app, this.server, this.socket,req, res));
			} catch (err) {
				console.error(`Erreur lors du chargement de ${file} :`, err.message);
			}
		})
	}
}

module.exports = FunctionOmsy