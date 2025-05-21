const fs = require('fs');
const path = require('path');

class ClassOmsy {
	constructor(CMS, app, server, socket) {
		this.CMS = CMS
		this.app = app
		this.server = server
		this.socket = socket

		this.functions = {};
	}

	loadFiles(folderFiles, types) {
		const allFiles = fs.readdirSync(folderFiles);

		allFiles.forEach((file) => {
			if (file === '.' || file === '..' || file === 'ClassOmsy.js') return;
			const modulePath = path.join(folderFiles, file);
			if (fs.statSync(modulePath).isDirectory()) return;

			const basename = path.basename(file, '.js');

			try {
				const func = require(modulePath);
				if(types == 'function') this.function[basename] = new func(this, this.app, this.server, this.socket);
				if(types == 'class') this.class[basename] = new func(this, this.app, this.server, this.socket);

				// Appelle une fonction d’enregistrement si besoin
		        if (typeof this.app.addFunction === 'function') this.app.addFunction(basename, func, types);

		        console.log(`${types} "${basename}" chargée.`);
			}
			catch (err) { console.error(`Erreur lors du chargement de ${file} :`, err.message); }
		})
	}

	getHtmlFile(filesName, callback) {
        const filePath = path.join(__dirname, `../../usr/panel/interface/${filesName}.html`);

        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                console.error('Erreur lors de la lecture du fichier :', err);
                return callback(err, null); // on retourne l'erreur au callback
            }

            const data = {
                title: 'Page manuelle',
                name: 'Jean'
            };
            const rendered = html.replace(/\$\{(.*?)\}\$/g, (_, key) => data[key.trim()] || '');
            callback(null, rendered); // on retourne le contenu au callback
        });
    }
}

module.exports = ClassOmsy;