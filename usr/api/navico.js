const path = require('path');
const fs = require('fs');

module.exports = function navico(req, res) {
  const plugin = req.query.id;

  if (!plugin) {
    return res.status(400).json({ error: 'Paramètre "id" manquant' });
  }

  const jsonPath = path.join(__dirname, '..', '..', 'usr', 'plugins', plugin, 'panel-ui', 'navico.json');

  let dashboardMenusJSON = [];
  try {
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      dashboardMenusJSON = JSON.parse(rawData) || [];

      // Modifier chaque entrée comme en PHP
      dashboardMenusJSON.forEach((entry) => {
        entry.url = `Getter?plugin=${plugin}&page=${entry.url}`;
      });
    }
  } catch (err) {
    console.error('Erreur lecture ou parsing JSON:', err.message);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }

  res.json(dashboardMenusJSON);
}