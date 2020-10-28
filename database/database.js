const sequelize = require('sequelize');
const connection= new sequelize('guiaperguntas','rodrigo.santos','Rodrigo@2020',{
    host:'windows',
    dialect: 'mysql'
});

module.exports = connection;