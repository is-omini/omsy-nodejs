const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = function Terminal(app, server, io, req, res) {
	io.on('connection', (socket) => {
	  console.log('🟢 Client connecté');

	  const sendPrompt = () => {
	    socket.emit('prompt', process.cwd());
	  };

	  // Envoyer le prompt dès la connexion
	  sendPrompt();

	  	
	  socket.on('command', (cmd) => {
	    const shell = spawn(cmd, { shell: true });
	    shell.stdout.setEncoding('utf8');
  		shell.stderr.setEncoding('utf8');
  		
	    shell.stdout.on('data', (data) => {
	      socket.emit('output', data.toString());
	    });

	    shell.stderr.on('data', (data) => {
	      socket.emit('output', data.toString());
	    });

	    shell.on('close', (code) => {
	      socket.emit('output', `\n`);
	      sendPrompt(); // ➜ réafficher le prompt
	    });
	  });
	});
	
	const filePath = path.join(__dirname, '/interface/terminal.html');
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