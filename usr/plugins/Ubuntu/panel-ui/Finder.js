const fs = require('fs');
const path = require('path');

module.exports = function Finder(app, server, io, req, res) {
	const requestedPath = req.query.path || '';
	const fullPath = path.join('/', requestedPath);

	if (!fs.existsSync(fullPath)) {
		return res.status(404).json({ error: 'Chemin non trouvé' });
	}

	const files = fs.readdirSync(fullPath, { withFileTypes: true });

	const items = files.map(file => ({
		name: file.name,
		isDirectory: file.isDirectory(),
		path: path.join(requestedPath, file.name)
	}));

	res.json({ currentPath: requestedPath, items });
}