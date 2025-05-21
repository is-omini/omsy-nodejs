module.exports = function Index(CMS, app, server, socket, req, res) {
    CMS.getHtmlFile('include/header', (err, headerHtml) => {
        if (err) return res.status(500).send('Erreur lors du chargement du header');

        CMS.getHtmlFile('index', (err, indexHtml) => {
            if (err) return res.status(500).send('Erreur lors du chargement de la page d\'index');

            CMS.getHtmlFile('include/footer', (err, footerHtml) => {
                if (err) return res.status(500).send('Erreur lors du chargement du footer');

                // Quand tout est récupéré, on envoie la réponse complète
                res.send(headerHtml + indexHtml + footerHtml);
            });
        });
    });
}
