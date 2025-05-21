// SERVERS
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Epxlorer
const path = require('path');
const fs = require('fs');

// Omsy
const ClassOmsy = require('./sys/class/ClassOmsy');

// Declaration
const PORT = 3000

const app = express();
const server = http.createServer(app);       // 👉 créer un serveur HTTP avec Express
const io = socketIO(server);                 // 👉 attacher Socket.IO à CE serveur

const CMS = {
  Function: [],
  Class: []
}

// fonctionnement
//app.use(express.json());
app.use(express.static(path.join(__dirname, 'usr/panel')));

app.addFunction = (name, fn, other) => {
  console.log(name, fn, other)
  if(other === 'function') CMS.Function[name] = fn;
  if(other === 'class') CMS.Class[name] = fn;
};

const Omsy = new ClassOmsy(CMS, app, server, io);
Omsy.loadFiles(path.join(__dirname, '/sys/class'), 'class');

app.get('/api/:module', (req, res) => {
  const moduleName = req.params.module;
  const modulePath = path.join(__dirname, 'usr/api', `${moduleName}.js`);

  // Vérifie si le fichier du module existe
  if (fs.existsSync(modulePath)) {
    try {
      const handler = require(modulePath);
      handler(req, res); // Appelle la fonction exportée
    } catch (err) {
      res.status(500).send(`Erreur dans le module ${moduleName}: ${err.message}`);
    }
  } else {
    res.status(404).send(`Module ${moduleName} introuvable`);
  }
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});