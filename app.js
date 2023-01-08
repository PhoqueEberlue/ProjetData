const express = require("express");
const http = require("http");

// On crée l'application express
const app = express();

// On dit que le dossier public doit être la racine pour les fichiers statiques
app.use(express.static('public'))

// Crée un serveur HTTP
const server = http.createServer(app);

// On allume le serveur au port 3000
server.listen(8888);

// Quand le serveur est allumé on le log
server.on('listening', function () {
    console.log("Le serveur est allumé sur le port 8888");
});

// Si il y a une erreur on la log
server.on('error', function (error) {
    console.error(error);
});
