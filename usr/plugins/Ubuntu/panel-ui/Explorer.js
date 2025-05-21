const fs = require('fs');
const path = require('path');

module.exports = function Explorer(app, server, io, req, res) {
	const filePath = path.join(__dirname, '/interface/explorer.html');
	fs.readFile(filePath, 'utf8', (err, html) => {
		if (err) {
			console.error('Erreur lors de la lecture du fichier :', err);
			return;
		}
		const data = {
			title: 'Page manuelle',
			name: 'Jean'
		};
		const rendered = html.replace(/\$\{(.*?)\}\$/g, (_, key) => data[key.trim()] || '');
		res.send(rendered);
	});
}