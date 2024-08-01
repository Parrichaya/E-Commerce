const Sequelize = require('sequelize');

const sequelize = new Sequelize('Ecommerce', 'root', 'a2c3b14d4', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;