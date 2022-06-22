const Squelize = require('sequelize');
const connection = new Squelize('guiaperguntas', "root", "root", { //nome da base, login, senha
    host: 'localhost', //endereço
    dialect: 'mysql' //tipo de banco
});

module.exports = connection;
